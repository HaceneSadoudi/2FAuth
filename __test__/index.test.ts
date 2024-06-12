import request from 'supertest'
import { app, prisma } from '../server'

async function deleteUserByEmail(email: string) {
    await prisma.user.deleteMany({
        where: {
            email: email
        }
    })
}

describe("otp", () => {
    
    describe("POST /register", () => {
        beforeAll(async() => {
            await deleteUserByEmail('testuser@gmail.com');
        })
        it('should register a user', async () => {
            const res = await request(app)
              .post('/api/auth/register')
              .send({ name: 'testuser', email: 'testuser@gmail.com', password: 'testpassword' })
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('message', 'Registered successfully');
          });
        it('should not register a user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ name: 'testuser', email: 'testuser@gmail.com', password: 'testpassword' })

            expect(res.status).toBe(409);
            expect(res.body).toHaveProperty('message', 'Email already exist, please try with another email address');    

        });
       /*  it("should generate an OTP", async() => {
            const response = await supertest
                .post('/otp/generate')
                .send({})
        }) */
    })
})