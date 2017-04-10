import { expect } from 'chai';
import app from '../../app';
import models from '../../models';
import helper from '../helper';

const request = require('supertest')(app);

const Role = models.Role;

const adminParams = helper.createAdmin();
const adminRoleParams = helper.createAdminRole();
const regularRoleParams = helper.createRegularRole();

describe('Role API', () => {
  let token;
  let role;

  before((done) => {
    Role.create(adminRoleParams)
      .then((adminRole) => {
        adminParams.roleId = adminRole.id;
        request.post('/user')
          .send(adminParams)
          .end((error, response) => {
            token = response.body.token;
            expect(response.status).to.equal(201);
            done();
          });
      });
  });

  beforeEach((done) => {
    Role.create(regularRoleParams)
      .then((regularRole) => {
        role = regularRole;
        done();
      });
  });

  afterEach(() => Role.destroy({ where: { id: role.id } }));

  after(() => models.sequelize.sync({ force: true }));

  describe('Role Requests', () => {
    describe('Create Role', () => {
      it(`should create a role when the required field a value
      is valid`, (done) => {
        const newRole = { title: 'almighty admin' };
        request.post('/role')
          .set({ Authorization: token })
          .send(newRole)
          .end((error, response) => {
            expect(response.status).to.equal(201);
            expect(response.body.role.title).to.equal(newRole.title);
            done();
          });
      });

      it('should not create a role when the required field is invalid',
        (done) => {
          const newRole = { name: 'guest' };
          request.post('/role')
            .set({ Authorization: token })
            .send(newRole)
            .expect(400);
          done();
        });

      it('should not create a role if the role already exists', (done) => {
        request.post('/role')
          .set({ Authorization: token })
          .send(regularRoleParams)
          .expect(409);
        done();
      });
    });

    describe('GET roles', () => {
      it('should not return roles when no token is provided', (done) => {
        request.get('/role')
          .expect(401);
        done();
      });

      it('should not return roles when the token provided is invalid',
        (done) => {
          request.get('/role')
            .set({ Authorization: 'invalidToken' })
            .expect(401, done);
        });

      it(`should return the roles requested for when the requester's
      token is valid`,
        (done) => {
          request.get('/role')
            .set({ Authorization: token })
            .end((error, response) => {
              expect(response.status).to.equal(200);
              // eslint-disable-next-line no-unused-expressions
              expect(Array.isArray(response.body)).to.be.true;
              expect(response.body.length).to.be.greaterThan(0);
              done();
            });
        });
    });

    describe('GET role by ID', () => {
      it('should not return any role when the ID supplied is invalid',
        (done) => {
          request.get('/role/999999')
            .set({ Authorization: token })
            .end((error, response) => {
              expect(response.status).to.equal(404);
              done();
            });
        });

      it('should return the role requested when a valid ID is provided',
        (done) => {
        request.get(`/role/${role.id}`)
          .set({ Authorization: token })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            done();
          });
      });
    });

    describe('Update Role (/PUT)', () => {
      it('should not update the role if a wrong ID is supplied', (done) => {
        const fieldsToUpdate = { title: 'occasional user' };
        request.put('/role/999999')
          .set({ Authorization: token })
          .send(fieldsToUpdate)
          .expect(404, done);
      });

      it('should allow update the role when the ID is valid', (done) => {
        const fieldsToUpdate = { title: 'observer' };
        request.put(`/role/${role.id}`)
          .set({ Authorization: token })
          .send(fieldsToUpdate)
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(response.body.title).to.equal(fieldsToUpdate.title);
            done();
          });
      });
    });

    describe('Deleting a ROLE', () => {
      it('should not delete a role when an invalid roleId is supplied',
        (done) => {
          request.delete('/role/999999')
            .set({ Authorization: token })
            .expect(404, done);
        });

      it('should delete a role when valid ID is provided',
        (done) => {
          request.delete(`/role/${role.id}`)
            .set({ Authorization: token })
            .end((error, response) => {
              expect(response.status).to.equal(200);
              expect(response.body.message)
                .to.equal('Role Successfully Deleted');
              done();
            });
        });
    });
  });
});

