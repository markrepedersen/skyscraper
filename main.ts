import {Chrome} from "automark";
import {
  FacebookHomePage,
  FacebookLoginPage,
  FacebookSearchPage,
} from "./facebook";
import {readFileSync, existsSync} from "fs";

type Credentials = {
  facebook: {
    username: string;
    password: string;
  };
};

export class Runner {
  public args!: any;
  public credentials: Credentials = this.loadCredentialsFile();

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
      .option("dir", {
        alias: "d",
        default: "images",
        type: "string",
        description: "The directory to put the images.",
      })
      .help()
      .strict().argv;
  }

  private loadCredentialsFile(): Credentials {
    let path: string = `${__dirname}/credentials.json`;
    if (!existsSync(path)) {
      throw new Error("No 'credentials.json' file given.");
    }
    return JSON.parse(readFileSync(path, "utf8"));
  }

  public async scrapeFacebook(
    query: string,
    image_dir: string,
    username: string,
    pw: string
  ) {
    let browser = new Chrome({maximized: true, headless: false});
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
    await searchPage.getProfiles(image_dir);
  }
}

function main() {
  let runner: Runner = new Runner();

  runner.scrapeFacebook(
    runner.args.query,
    runner.args.dir,
    runner.credentials.facebook?.username,
    runner.credentials.facebook?.password
  );
}

main();
