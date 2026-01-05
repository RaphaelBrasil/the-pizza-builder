const request = require('supertest');
const app = require('../../app');

describe('Pizza API routes', () => {
  it('GET /health should return ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('GET /sizes should return available sizes', async () => {
    const res = await request(app).get('/sizes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toMatchObject({ id: 'sm', name: 'Small', basePrice: expect.any(Number) });
  });

  it('GET /ingredients should return available ingredients', async () => {
    const res = await request(app).get('/ingredients');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toMatchObject({ id: expect.any(String), name: expect.any(String), extraPrice: expect.any(Number) });
  });

  it('POST /pizzas should create a new pizza with final price', async () => {
    const payload = {
      customerName: 'Alice',
      sizeId: 'md',
      ingredientIds: ['cheese', 'pepperoni', 'olive'],
    };
    const res = await request(app).post('/pizzas').send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      customerName: payload.customerName,
      size: { id: payload.sizeId },
      ingredients: expect.any(Array),
      finalPrice: expect.any(Number),
      createdAt: expect.any(String),
    });
  });

  it('POST /pizzas should reject invalid size', async () => {
    const res = await request(app)
      .post('/pizzas')
      .send({ customerName: 'Bob', sizeId: 'xx', ingredientIds: ['cheese'] });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid sizeId: xx' });
  });

  it('GET /pizzas should list created pizzas and allow filtering', async () => {
    await request(app).post('/pizzas').send({
      customerName: 'Carol',
      sizeId: 'sm',
      ingredientIds: ['cheese'],
    });

    const res = await request(app).get('/pizzas').query({ customerName: 'car' });

    expect(res.status).toBe(200);
    expect(res.body.some((pizza) => pizza.customerName === 'Carol')).toBe(true);
  });

  it('GET /pizzas/:id should return a pizza when it exists', async () => {
    const created = await request(app).post('/pizzas').send({
      customerName: 'Dave',
      sizeId: 'lg',
      ingredientIds: ['cheese'],
    });

    const pizzaId = created.body.id;
    const res = await request(app).get(`/pizzas/${pizzaId}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: pizzaId, customerName: 'Dave' });
  });

  it('GET /pizzas/:id should return 404 for missing pizza', async () => {
    const res = await request(app).get('/pizzas/99999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Pizza not found' });
  });
});
