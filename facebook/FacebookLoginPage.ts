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
export class FacebookLoginPage extends Page {
  public static URL: string = "https://www.facebook.com";

  @findBy('input.inputtext.login_form_input_box[type="email"]')
  protected emailLoginInput!: TextInput;

  @findBy('input.inputtext.login_form_input_box[type="password"]')
  protected pwLoginInput!: TextInput;

  @findBy("#loginbutton")
  protected loginButton!: Button;

  public loadCondition(): WaitCondition {
    return elementIsVisible(() => this.emailLoginInput);
  }

  /**
   * Enters login information and logs into account.
   */
  public async login(email: string, pw: string): Promise<void> {
    await this.emailLoginInput.fill(email);
    await this.pwLoginInput.fill(pw);
    await this.loginButton.click();
  }
}
