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

  public async getProfiles(dir: string): Promise<void> {
    let links = [];
    links.push(...(await this.getInitialContainerLinks()));
    links.push(...(await this.getSecondContainerLinks()));
    links.push(...(await this.getRemainingContainerLinks()));
    await this.handleLinks(dir, links);
  }

  private async handleLinks(dir: string, links: string[]) {
    for (let i = 0; i < links.length; i++) {
      await this.browser.navigate(links[i]);
      await this.browser.waitUntilPageHasLoaded(FacebookProfilePage);
      let profilePage = new FacebookProfilePage(this.browser);
      await profilePage.saveProfilePicture(dir, `img${i}.jpg`);
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

  private async waitForPagination(): Promise<boolean> {
    await this.browser.driver.executeScript(
      "window.scrollTo(0, document.body.scrollHeight)"
    );
    await (await this.browser.driver).sleep(1000);
    return !(await this.browser.exists("#browse_end_of_results_footer"));
  }

  private async getRemainingContainerLinks(): Promise<string[]> {
    let links = [];
    let i = 0;
    while (await this.waitForPagination() && i < 20) {
      if (
        await this.browser.exists(
          `#fbBrowseScrollingPagerContainer${i} a[aria-hidden="true`
        )
      ) {
        links.push(
          ...(await this.getLinks(
            `#fbBrowseScrollingPagerContainer${i++} a[aria-hidden="true"]`
          ))
        );
        console.log(links);
      }
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
