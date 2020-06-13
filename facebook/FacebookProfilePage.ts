import {
  Page,
  elementIsVisible,
  findBy,
  log,
  validate,
  WaitCondition,
  WebComponent,
} from "automark";
import {get} from "https";
import {promises as fs, createWriteStream} from "fs";

@log
@validate
export class FacebookProfilePage extends Page {
  private static IMAGE_DIR = "./images/";

  @findBy("a.profilePicThumb img")
  protected profilePic!: WebComponent;

  public loadCondition(): WaitCondition {
    return elementIsVisible(() => this.profilePic);
  }

  public async saveProfilePicture(location: string) {
    let url: string = await this.profilePic.getElementAttribute("src");
    await this.pipeToFile(url, location);
  }

  private async pipeToFile(url: string, filename: string) {
    await fs.mkdir(FacebookProfilePage.IMAGE_DIR, {recursive: true});
    get(url, (res) =>
      res.pipe(
        createWriteStream(`${FacebookProfilePage.IMAGE_DIR}/${filename}`)
      )
    );
  }
}
