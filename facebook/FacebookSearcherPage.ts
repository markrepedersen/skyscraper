import {
  Page,
  elementIsVisible,
  findBy,
  log,
  validate,
  WaitCondition,
  WebComponent,
} from "automark";
import {FacebookProfilePage} from "./FacebookProfilePage";

@log
@validate
export class FacebookSearchPage extends Page {
  @findBy("#initial_browse_result")
  protected searchResults!: WebComponent;

  public loadCondition(): WaitCondition {
    return elementIsVisible(() => this.searchResults);
  }

  public async getProfiles(): Promise<void> {
    let links = [];
    links.push(...(await this.getInitialContainerLinks()));
    links.push(...(await this.getSecondContainerLinks()));
    links.push(...(await this.getRemainingContainerLinks()));
    await this.handleLinks(links);
  }

  private async handleLinks(links: string[]) {
    let i = 0;
    for (const link of links) {
      await this.browser.navigate(link);
      await this.browser.waitUntilPageHasLoaded(FacebookProfilePage);
      let profilePage = new FacebookProfilePage(this.browser);
      await profilePage.saveProfilePicture(`img${i}.jpg`);
      await (await this.browser.driver).navigate().back();
      await this.browser.waitUntilPageHasLoaded(FacebookSearchPage);
      i++;
    }
  }

  private async getInitialContainerLinks(): Promise<string[]> {
    return this.getLinks(
      '#BrowseResultsContainer div[data-testid="browse-result-content"] a[title]'
    );
  }

  private async getSecondContainerLinks(): Promise<string[]> {
    return this.getLinks(
      'div[data-testid="paginated_results"] div[data-testid="results"] div[data-testid="browse-result-content"] a[title]'
    );
  }

  private async getRemainingContainerLinks(): Promise<string[]> {
    let links = [];
    let i = 0;
    while (await this.browser.exists(`#fbBrowseScrollingPagerContainer${i}`)) {
      links.push(
        ...(await this.getLinks(`#fbBrowseScrollingPagerContainer${i}`))
      );
    }
    return links;
  }

  private async getLinks(query: string): Promise<string[]> {
    let links = [];
    let results = await this.browser.findElements(query);

    for (const e of results) {
      links.push(await e.getElementAttribute("href"));
    }
    return links;
  }
}
