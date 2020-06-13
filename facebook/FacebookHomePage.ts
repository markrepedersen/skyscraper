import {
  Page,
  elementIsVisible,
  findBy,
  log,
  TextInput,
  validate,
  WaitCondition,
  Button,
} from "automark";

@log
@validate
export class FacebookHomePage extends Page {
  @findBy('input[placeholder="Search"][aria-label="Search"]')
  protected searchInput!: TextInput;

  @findBy('button[aria-label="Search"]')
  protected searchButton!: Button;

  @findBy('a[role="tab"][href*="/search/people/"]')
  protected peopleTab!: Button;

  public loadCondition(): WaitCondition {
    return elementIsVisible(() => this.searchInput);
  }

  /**
   * Search for content using the search input.
   */
  public async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchButton.click();
    await this.browser.waitUntilElementIsVisible(() => this.peopleTab);
    await this.peopleTab.click();
  }
}
