const { createReq, doLogin } = require('../../../tests/apiTestUtils');
const { setUpMongo } = require('../../../tests/mockMongoSetup');

const asmntService = require('../asmnt.service');
const getRandomAsmnt = require('../asmnt.interface/randomAsmnt');

const { createAsmntActivity } = require('../../activity/activity.service');

jest.mock('../../activity/activity.service');

const BASE_PATH = 'assessment';

describe('Assessment routes tests', () => {
    /** MONGO SETUP AND LOGIN */

    setUpMongo();
    beforeAll(async () => {
        await doLogin({ username: 'Aviv', password: '12345' });
    });

    beforeEach(() => createAsmntActivity.mockReset());


    /** ASSESSMENT ROUTES */

    it('should query a map object of assessments', async () => {
        const res = await createReq('get', BASE_PATH);
        const asmntsMap = res.body;

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(asmntsMap.user)).toBe(true);
        expect(Array.isArray(asmntsMap.aproval)).toBe(true);
        expect(Array.isArray(asmntsMap.review)).toBe(true);
        expect(Array.isArray(asmntsMap.shared)).toBe(true);
    });


    it('should get an assessment by id', async () => {
        const asmntId = '60252e8d2115cc55844aabd4';
        const res = await createReq('get', `${BASE_PATH}/${asmntId}`);
        const asmnt = res.body;

        expect(res.statusCode).toBe(200);
        expect(asmnt._id.toString()).toBe(asmntId);
    });


    it('should remove an assessment by id', async () => {
        const asmntIdToRemove = '60252e8d2115cc55844aabd8';
        const res = await createReq('delete', `${BASE_PATH}/${asmntIdToRemove}`);
        const asmntId = res.res.text;

        expect(res.statusCode).toBe(200);
        expect(asmntId.toString()).toBe(asmntIdToRemove);
    });


    it('should fail update an assessment for no access premission', async () => {
        await doLogin({ username: 'Auditor', password: 'asdasd' });
        const updateData = {
            _id: '60252e8d2115cc55844aabd9',
            name: 'new asmnt name!'
        }
        const res = await createReq('put', `${BASE_PATH}`, { asmnt: updateData });
        
        expect(res.statusCode).toBe(403);
        expect(res.body.message).toBe('authorizationError');
        await doLogin({ username: 'Aviv', password: '12345' });
    });

    it('should update an assessment', async () => {
        const updateData = {
            _id: '60252e8d2115cc55844aabd1',
            name: 'new asmnt name!'
        }
        const res = await createReq('put', `${BASE_PATH}`, { asmnt: updateData });
        const asmnt = res.body;

        expect(res.statusCode).toBe(200);
        expect(asmnt.name).toBe('new asmnt name!');
        expect(asmnt._id.toString()).toBe(updateData._id);

        expect(createAsmntActivity).toHaveBeenCalled();
    });


    it('should update an assessment status', async () => {   // NEEDS A FIX //
        const status = 'shared';
        const res = await createReq('put', `${BASE_PATH}/${'60252e8d2115cc55844aabdb'}/status/${status}`);
        const msg = res.res.text;

        expect(res.statusCode).toBe(200);
        expect(typeof (msg)).toBe('string');
        
        expect(createAsmntActivity).toHaveBeenCalled();
    });


    it('should fail adding a new assessment', async () => {
        const asmntToAdd = { name: 'new asmnt!' };
        const res = await createReq('post', `${BASE_PATH}`, { asmnt: asmntToAdd });
        expect(res.statusCode).toBe(403);
    });

    it('should add a new assessment', async () => {
        const asmntToAdd = getRandomAsmnt();
        asmntToAdd.updatedAt = asmntToAdd.createdAt = asmntToAdd.creator = null;
        asmntToAdd.name = 'new asmnt!';


        const res = await createReq('post', `${BASE_PATH}`, { asmnt: asmntToAdd });
        const asmnt = res.body;

        expect(res.statusCode).toBe(200);
        expect(asmnt._id).toBeTruthy();
        expect(asmnt.createdAt).toBeTruthy();
        expect(asmnt.updatedAt).toBeTruthy();
        expect(asmnt.creator).toBeTruthy();
        expect(asmnt.name).toBe(asmntToAdd.name);

        expect(createAsmntActivity).toHaveBeenCalled();
    });

});