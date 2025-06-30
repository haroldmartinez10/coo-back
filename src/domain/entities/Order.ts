export class Order {
  public id?: number;
  public userId: number;
  public originCity: string;
  public destinationCity: string;
  public weight: number;
  public height: number;
  public width: number;
  public length: number;
  public basePrice: number;
  public trackingCode: string;
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
    basePrice: number,
    trackingCode: string,
    status: string = "pending"
  ) {
    this.userId = userId;
    this.originCity = originCity;
    this.destinationCity = destinationCity;
    this.weight = weight;
    this.height = height;
    this.width = width;
    this.length = length;
    this.basePrice = basePrice;
    this.trackingCode = trackingCode;
    this.status = status;
  }
}
