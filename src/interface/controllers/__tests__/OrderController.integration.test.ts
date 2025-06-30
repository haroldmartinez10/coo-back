import Fastify, { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken";
import { OrderRepositoryImpl } from "@infrastructure/repositories/OrderRepository";
import { redisClient } from "@infrastructure/cache/redis-client";
import orderRoutes from "../../routes/orderRoutes";
import {
  mockUserId,
  mockOrders,
  mockOrdersJSON,
} from "../../../__tests__/setup";

jest.mock("@infrastructure/repositories/OrderRepository");
jest.mock("@infrastructure/cache/redis-client");

const mockOrderRepository = OrderRepositoryImpl as jest.MockedClass<
  typeof OrderRepositoryImpl
>;
const mockRedisClient = redisClient as jest.Mocked<typeof redisClient>;

describe("GET /orders - Integration Test", () => {
  let app: FastifyInstance;
  let userToken: string;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    await app.register(orderRoutes);

    userToken = jwt.sign(
      { userId: mockUserId, role: "user" },
      process.env.JWT_SECRET || "test-secret",
      { expiresIn: "1h" }
    );
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockOrderRepository.prototype.findOrdersByUserId = jest.fn();
    mockRedisClient.getUserOrdersFromCache = jest.fn();
    mockRedisClient.saveUserOrdersToCache = jest.fn();
  });

  it("should return user orders from database when cache is empty", async () => {
    mockRedisClient.getUserOrdersFromCache.mockResolvedValue(null);
    mockOrderRepository.prototype.findOrdersByUserId.mockResolvedValue(
      mockOrders
    );

    const response = await app.inject({
      method: "GET",
      url: "/orders",
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.message).toBe("Órdenes obtenidas exitosamente");
    expect(body.data).toEqual(mockOrdersJSON);

    expect(mockRedisClient.getUserOrdersFromCache).toHaveBeenCalledWith(
      mockUserId
    );
    expect(
      mockOrderRepository.prototype.findOrdersByUserId
    ).toHaveBeenCalledWith(mockUserId);
  });
});
