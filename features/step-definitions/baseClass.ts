import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { BrowserContext, Page } from '@playwright/test';

export interface CucumberWorldConstructorParams {
  parameters: { [key: string]: any };
}

export class BaseClass extends World {
  public context!: BrowserContext;
  public page!: Page;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(BaseClass);