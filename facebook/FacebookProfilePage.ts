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
  @findBy("a.profilePicThumb img")
  protected profilePic!: WebComponent;

  public loadCondition(): WaitCondition {
    return elementIsVisible(() => this.profilePic);
  }

  public async saveProfilePicture(dir: string, filename: string) {
    let url: string = await this.profilePic.getElementAttribute("src");
    await this.pipeToFile(url, dir, filename);
  }

  private async pipeToFile(url: string, dir: string, filename: string) {
    await fs.mkdir(dir, {recursive: true});
    get(url, (res) => res.pipe(createWriteStream(`${dir}/${filename}`)));
  }
}
