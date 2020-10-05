import ISendMailDTO from "../dtos/ISendMailDTO";

export default interface IMailProvider {
  sendMail(mail: ISendMailDTO): Promise<void>;
}
