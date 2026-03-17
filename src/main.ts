import './styles.css';
import { VimEngine } from './core/vim-engine.ts';
import { EditorUI } from './ui/editor.ts';
import { StatuslineUI } from './ui/statusline.ts';
import { FeedbackUI } from './ui/feedback.ts';
import { ProgressTracker } from './ui/progress.ts';
import { MotionTrainer } from './modes/motion-trainer.ts';
import { CommandTrainer } from './modes/command-trainer.ts';
import { ChallengeMode } from './modes/challenge-mode.ts';
import { motionExercises } from './exercises/motions.ts';
import { commandExercises } from './exercises/commands.ts';
import { challengeExercises } from './exercises/challenges.ts';
import { Exercise, ExerciseMode } from './exercises/types.ts';
import { cheatsheetData, searchCommands, VimCommand } from './data/cheatsheet-data.ts';

type AppView = 'trainer' | 'cheatsheet';

class VimTrainerApp {
  private engine: VimEngine;
  private editorUI: EditorUI;
  private statuslineUI: StatuslineUI;
  private feedbackUI: FeedbackUI;
  private progress: ProgressTracker;

  private motionTrainer: MotionTrainer;
  private commandTrainer: CommandTrainer;
  private challengeMode: ChallengeMode;

  private currentMode: ExerciseMode = 'motions';
  private currentExerciseIndex = 0;
  private hintVisible = false;
  private currentView: AppView = 'trainer';
  private searchQuery = '';
  private selectedCategory = '';

  constructor() {
    // Initialize core
    this.engine = new VimEngine();

    // Initialize UI
    this.editorUI = new EditorUI('.editor-container');
    this.statuslineUI = new StatuslineUI('.statusline');
    this.feedbackUI = new FeedbackUI();
    this.progress = new ProgressTracker();

    // Initialize trainers
    this.motionTrainer = new MotionTrainer(
      this.engine,
      this.editorUI,
      this.statuslineUI,
      this.feedbackUI
    );

    this.commandTrainer = new CommandTrainer(
      this.engine,
      this.editorUI,
      this.statuslineUI,
      this.feedbackUI
    );

    this.challengeMode = new ChallengeMode(
      this.engine,
      this.editorUI,
      this.statuslineUI,
      this.feedbackUI
    );

    // Set up completion handlers
    this.motionTrainer.setOnComplete((id, keystrokes) => {
      this.progress.markCompleted(id, keystrokes);
      this.updateProgress();
      this.renderExerciseList();
    });

    this.commandTrainer.setOnComplete((id, keystrokes) => {
      this.progress.markCompleted(id, keystrokes);
      this.updateProgress();
      this.renderExerciseList();
    });

    this.challengeMode.setOnComplete((id, keystrokes, time) => {
      this.progress.markCompleted(id, keystrokes, time);
      this.updateProgress();
      this.renderExerciseList();
    });

    this.setupEventListeners();
    this.initCheatsheet();
    this.loadMode('motions');
  }

  private setupEventListeners(): void {
    // Keyboard input
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));

    // Navigation buttons
    document.querySelectorAll('.nav-btn[data-mode]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const mode = (e.target as HTMLElement).dataset.mode;
        if (mode === 'cheatsheet') {
          this.showCheatsheet();
        } else if (mode) {
          this.showTrainer();
          this.loadMode(mode as ExerciseMode);
        }
      });
    });

    // Control buttons
    document.getElementById('reset-btn')?.addEventListener('click', () => this.resetExercise());
    document.getElementById('skip-btn')?.addEventListener('click', () => this.nextExercise());
    document.getElementById('hint-btn')?.addEventListener('click', () => this.toggleHint());

    // Exercise list click handler
    document.getElementById('exercise-list')?.addEventListener('click', (e) => {
      const item = (e.target as HTMLElement).closest('.exercise-list-item');
      if (item) {
        const index = parseInt(item.getAttribute('data-index') || '0', 10);
        this.loadExerciseByIndex(index);
      }
    });

    // Cheatsheet search and filter
    document.getElementById('cheatsheet-search')?.addEventListener('input', (e) => {
      this.searchQuery = (e.target as HTMLInputElement).value;
      this.renderCheatsheet();
    });

    document.getElementById('category-select')?.addEventListener('change', (e) => {
      this.selectedCategory = (e.target as HTMLSelectElement).value;
      this.renderCheatsheet();
    });

    // Next exercise event (from completion modal)
    window.addEventListener('next-exercise', () => this.nextExercise());
  }

  private initCheatsheet(): void {
    // Populate category select
    const select = document.getElementById('category-select') as HTMLSelectElement;
    if (select) {
      cheatsheetData.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
      });
    }
  }

  private showTrainer(): void {
    this.currentView = 'trainer';
    document.getElementById('trainer-view')?.classList.remove('hidden');
    document.getElementById('cheatsheet-view')?.classList.add('hidden');

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach((btn) => {
      const mode = (btn as HTMLElement).dataset.mode;
      btn.classList.toggle('active', mode === this.currentMode);
    });
  }

  private showCheatsheet(): void {
    this.currentView = 'cheatsheet';
    document.getElementById('trainer-view')?.classList.add('hidden');
    document.getElementById('cheatsheet-view')?.classList.remove('hidden');

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach((btn) => {
      const mode = (btn as HTMLElement).dataset.mode;
      btn.classList.toggle('active', mode === 'cheatsheet');
    });

    this.renderCheatsheet();

    // Focus search
    setTimeout(() => {
      document.getElementById('cheatsheet-search')?.focus();
    }, 100);
  }

  private renderCheatsheet(): void {
    const container = document.getElementById('cheatsheet-content');
    if (!container) return;

    const query = this.searchQuery.toLowerCase().trim();
    const categoryId = this.selectedCategory;

    // If searching, use the search function
    if (query) {
      const results = searchCommands(query);

      // Update count
      const countEl = document.getElementById('search-count');
      if (countEl) {
        countEl.textContent = `${results.length} commands`;
      }

      if (results.length === 0) {
        container.innerHTML = `
          <div class="no-results">
            <p>No commands found for "${this.escapeHtml(query)}"</p>
            <p class="no-results-hint">Try: motion, delete, change, yank, bracket, word, line</p>
          </div>
        `;
        return;
      }

      container.innerHTML = results
        .map(({ cmd, category }) => this.renderCommandCard(cmd, category, query))
        .join('');
      return;
    }

    // Filter by category or show all
    const categoriesToShow = categoryId
      ? cheatsheetData.filter(c => c.id === categoryId)
      : cheatsheetData;

    // Count total commands
    const totalCommands = categoriesToShow.reduce((sum, c) => sum + c.commands.length, 0);
    const countEl = document.getElementById('search-count');
    if (countEl) {
      countEl.textContent = `${totalCommands} commands`;
    }

    // Render categories with their commands
    container.innerHTML = categoriesToShow
      .map(category => `
        <div class="category-section">
          <div class="category-header">
            <h2>${category.name}</h2>
            <p>${category.description}</p>
          </div>
          <div class="commands-grid">
            ${category.commands.map(cmd => this.renderCommandCard(cmd, category.name, '')).join('')}
          </div>
        </div>
      `)
      .join('');
  }

  private renderCommandCard(cmd: VimCommand, categoryName: string, query: string): string {
    const highlightText = (text: string): string => {
      if (!query) return this.escapeHtml(text);
      const escaped = this.escapeHtml(text);
      const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
      return escaped.replace(regex, '<span class="highlight">$1</span>');
    };

    const tagsHtml = cmd.tags.slice(0, 3).map(tag =>
      `<span class="cmd-tag">${this.escapeHtml(tag)}</span>`
    ).join('');

    const exampleHtml = cmd.example
      ? `<div class="cmd-example"><span class="example-label">Example:</span> ${highlightText(cmd.example)}</div>`
      : '';

    return `
      <div class="command-card">
        <div class="cmd-header">
          <kbd class="cmd-key">${this.escapeHtml(cmd.key)}</kbd>
          ${query ? `<span class="cmd-category">${this.escapeHtml(categoryName)}</span>` : ''}
        </div>
        <div class="cmd-body">
          <h3 class="cmd-description">${highlightText(cmd.description)}</h3>
          <p class="cmd-details">${highlightText(cmd.details)}</p>
          ${exampleHtml}
        </div>
        <div class="cmd-tags">${tagsHtml}</div>
      </div>
    `;
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  private escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private loadExerciseByIndex(index: number): void {
    this.currentExerciseIndex = index;
    this.loadCurrentExercise();
    this.renderExerciseList();
  }

  private renderExerciseList(): void {
    const exercises = this.getExercises();
    const listEl = document.getElementById('exercise-list');
    if (!listEl) return;

    const completedCount = exercises.filter(e => this.progress.isCompleted(e.id)).length;

    // Update count
    const countEl = document.querySelector('.exercise-count');
    if (countEl) {
      countEl.textContent = `${completedCount}/${exercises.length}`;
    }

    // Render list
    listEl.innerHTML = exercises.map((exercise, index) => {
      const isCompleted = this.progress.isCompleted(exercise.id);
      const isActive = index === this.currentExerciseIndex;
      const classes = [
        'exercise-list-item',
        isCompleted ? 'completed' : '',
        isActive ? 'active' : '',
      ].filter(Boolean).join(' ');

      return `
        <li class="${classes}" data-index="${index}">
          <span class="exercise-status"></span>
          <span class="exercise-name">${exercise.title}</span>
          <span class="exercise-difficulty ${exercise.difficulty}">${exercise.difficulty[0]}</span>
        </li>
      `;
    }).join('');
  }

  private handleKeyDown(e: KeyboardEvent): void {
    // Don't intercept keys when in cheatsheet view (allow typing in search)
    if (this.currentView === 'cheatsheet') {
      // Only handle Escape to go back
      if (e.key === 'Escape') {
        e.preventDefault();
        this.showTrainer();
      }
      return;
    }

    // Prevent browser shortcuts
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    // Global shortcuts
    if (e.key === 'r' && this.engine.getState().mode === 'normal') {
      // Let 'r' through for replace command if followed by another key
      // But handle reset on just 'r' press without pending command
      if (this.engine.getState().commandBuffer === '') {
        // Don't intercept - let engine handle 'r'
      }
    }
    if (e.key === 'n' && this.engine.getState().mode === 'normal' &&
        this.engine.getState().commandBuffer === '') {
      e.preventDefault();
      this.nextExercise();
      this.renderExerciseList();
      return;
    }
    if (e.key === 'h' && this.engine.getState().mode === 'normal' &&
        this.engine.getState().commandBuffer === '' && e.shiftKey) {
      e.preventDefault();
      this.toggleHint();
      return;
    }
    // Open cheatsheet with ?
    if (e.key === '?' && this.engine.getState().mode === 'normal') {
      e.preventDefault();
      this.showCheatsheet();
      return;
    }

    // Handle vim keys
    const key = e.key;
    if (key === 'Escape') {
      // Handle Escape
    } else if (key === 'Backspace') {
      // Handle Backspace in insert mode
    } else if (key === 'Enter') {
      // Handle Enter in insert mode
    } else if (key.length > 1 && key !== 'Escape' && key !== 'Backspace' && key !== 'Enter') {
      // Ignore other special keys like arrows, function keys
      return;
    }

    e.preventDefault();

    const handled = this.getCurrentTrainer().handleKey(key);
    if (!handled && this.engine.getState().mode === 'normal') {
      this.feedbackUI.flashError();
    }
  }

  private getCurrentTrainer(): MotionTrainer | CommandTrainer | ChallengeMode {
    switch (this.currentMode) {
      case 'motions': return this.motionTrainer;
      case 'commands': return this.commandTrainer;
      case 'challenges': return this.challengeMode;
      default: return this.motionTrainer;
    }
  }

  private getExercises(): Exercise[] {
    switch (this.currentMode) {
      case 'motions': return motionExercises;
      case 'commands': return commandExercises;
      case 'challenges': return challengeExercises;
      default: return motionExercises;
    }
  }

  private loadMode(mode: ExerciseMode): void {
    // Cleanup previous mode
    if (this.currentMode === 'challenges') {
      this.challengeMode.cleanup();
    }

    this.currentMode = mode;
    this.currentExerciseIndex = 0;
    this.hintVisible = false;

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach((btn) => {
      btn.classList.toggle('active', (btn as HTMLElement).dataset.mode === mode);
    });

    // Show/hide timer
    this.feedbackUI.showTimer(mode === 'challenges');

    this.loadCurrentExercise();
    this.updateProgress();
    this.renderExerciseList();
  }

  private loadCurrentExercise(): void {
    const exercises = this.getExercises();
    const exercise = exercises[this.currentExerciseIndex];

    if (!exercise) return;

    // Update UI
    document.querySelector('.exercise-title')!.textContent = exercise.title;
    document.querySelector('.exercise-description')!.textContent = exercise.description;

    // Hide hint
    this.hintVisible = false;
    const hintBox = document.querySelector('.hint-box') as HTMLElement;
    hintBox.classList.remove('visible');
    document.querySelector('.hint-text')!.textContent = exercise.hints[0] || '';

    // Load into trainer
    this.getCurrentTrainer().loadExercise(exercise);
  }

  private nextExercise(): void {
    const exercises = this.getExercises();
    this.currentExerciseIndex = (this.currentExerciseIndex + 1) % exercises.length;
    this.loadCurrentExercise();
  }

  private resetExercise(): void {
    this.getCurrentTrainer().reset();
    this.hintVisible = false;
    const hintBox = document.querySelector('.hint-box') as HTMLElement;
    hintBox.classList.remove('visible');
  }

  private toggleHint(): void {
    this.hintVisible = !this.hintVisible;
    const hintBox = document.querySelector('.hint-box') as HTMLElement;
    hintBox.classList.toggle('visible', this.hintVisible);
  }

  private updateProgress(): void {
    const exercises = this.getExercises();
    const completedInMode = exercises.filter((e) => this.progress.isCompleted(e.id)).length;
    this.feedbackUI.setProgress(completedInMode, exercises.length);
  }
}

// Initialize app
new VimTrainerApp();
