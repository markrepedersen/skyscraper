import {Chrome} from "automark";
import {
  FacebookHomePage,
  FacebookLoginPage,
  FacebookSearchPage,
} from "./facebook";

export class Runner {
  public args!: any;

  constructor() {
    this.args = require("yargs")
      .option("query", {
        alias: "q",
        type: "string",
        description:
          "The search query. This can be anything from a social media username to a person's real name. However, the more accurate it is, the better the results will be.",
      })
      .option("photo", {
        alias: "p",
        type: "string",
        description: "The path to the photo.",
      })
      .help()
      .strict().argv;
  }

  public async scrapeFacebook(query: string, username: string, pw: string) {
    let browser = new Chrome();
    const loginPage: FacebookLoginPage = new FacebookLoginPage(browser);
    await browser.navigate(FacebookLoginPage.URL);
    await browser.waitUntilPageHasLoaded(FacebookLoginPage);
    await loginPage.login(username, pw);
    await browser.waitUntilPageHasLoaded(FacebookHomePage);

    await browser.navigate(
      `${FacebookLoginPage.URL}/search/people/?q=${query}`
    );

    await browser.waitUntilPageHasLoaded(FacebookSearchPage);
    let searchPage: FacebookSearchPage = new FacebookSearchPage(browser);
    await searchPage.getProfiles();

    await browser.quit();
  }
}

let runner: Runner = new Runner();
runner.scrapeFacebook(runner.args.query, "goldenied", "Goldenied1!");
