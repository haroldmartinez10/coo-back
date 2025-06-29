export class Order {
  public id?: number;
  public userId: number;
  public originCity: string;
  public destinationCity: string;
  public weight: number;
  public height: number;
  public width: number;
  public length: number;
  public totalPrice: number;
  public status: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(
    userId: number,
    originCity: string,
    destinationCity: string,
    weight: number,
    height: number,
    width: number,
    length: number,
    totalPrice: number,
    status: string = "pending"
  ) {
    this.userId = userId;
    this.originCity = originCity;
    this.destinationCity = destinationCity;
    this.weight = weight;
    this.height = height;
    this.width = width;
    this.length = length;
    this.totalPrice = totalPrice;
    this.status = status;
  }
}
