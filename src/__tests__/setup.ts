jest.mock("@infrastructure/cache/redis-client", () => ({
  redisClient: {
    getUserOrdersFromCache: jest.fn(),
    saveUserOrdersToCache: jest.fn(),
    invalidateUserOrders: jest.fn(),
  },
}));

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret";
process.env.DB_HOST = "localhost";
process.env.DB_PORT = "3306";
process.env.DB_USER = "test";
process.env.DB_PASSWORD = "test";
process.env.DB_NAME = "test_db";
process.env.REDIS_HOST = "localhost";
process.env.REDIS_PORT = "6379";

export const mockUserId = 1;
export const mockAdminUserId = 999;

export const mockOrder = {
  id: 1,
  userId: mockUserId,
  originCity: "Bogotá",
  destinationCity: "Medellín",
  weight: 5.5,
  height: 20,
  width: 30,
  length: 40,
  basePrice: 25000,
  trackingCode: "COO-123456789",
  status: "pending",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
};

export const mockOrderJSON = {
  id: 1,
  userId: mockUserId,
  originCity: "Bogotá",
  destinationCity: "Medellín",
  weight: 5.5,
  height: 20,
  width: 30,
  length: 40,
  basePrice: 25000,
  trackingCode: "COO-123456789",
  status: "pending",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

export const mockOrders = [
  mockOrder,
  { ...mockOrder, id: 2, trackingCode: "COO-987654321" },
];

export const mockOrdersJSON = [
  mockOrderJSON,
  { ...mockOrderJSON, id: 2, trackingCode: "COO-987654321" },
];

beforeEach(() => {
  jest.clearAllMocks();
});
