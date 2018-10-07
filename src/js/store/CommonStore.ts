import { action, observable } from 'mobx';
import { BaseChildStore } from './BaseChildStore';
import { RootStore } from './RootStore';

class LoadingStore {
  private DEFAULT_TEXT_CONTENT: string = '';

  @observable public visible: boolean = false;
  @observable public textContent: string = this.DEFAULT_TEXT_CONTENT;
  @action public show(textContent: string = this.DEFAULT_TEXT_CONTENT) {
    this.textContent = textContent;
    this.visible = true;
  }
  @action public hide() {
    this.visible = false;
  }
  @action public toggle() {
    this.visible = !this.visible;
  }
}

export class CommonStore extends BaseChildStore {
  public readonly loadingStore: LoadingStore;
  constructor(rootStore: RootStore) {
    super(rootStore);
    this.loadingStore = new LoadingStore();
  }
}
