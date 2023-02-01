const asmntService = require('../asmnt.service.js');
const { setUpMongo } = require('../../../tests/mockMongoSetup');

describe('Assessment service test', () => {
    /** MONGO SETUP */

    setUpMongo();

    
    /** ASSESSMENT CRUD FUNCTIONALITIES */

    it('should query an assessments map object', async () => {
        const asmntsMap = await asmntService.query({ '_id': '5fb671b4a2a5d75ca450499b' });
        expect(Array.isArray(asmntsMap.user)).toBe(true);
        expect(Array.isArray(asmntsMap.aproval)).toBe(true);
        expect(Array.isArray(asmntsMap.review)).toBe(true);
        expect(Array.isArray(asmntsMap.shared)).toBe(true);
    });

    it('should get a single assessment', async () => {
        const asmnt = await asmntService.getById('60252e8d2115cc55844aabd2');
        expect(typeof (asmnt)).toBe('object');
        expect(asmnt._id.toString()).toBe('60252e8d2115cc55844aabd2');
        expect(Array.isArray(asmnt.attachments)).toBe(true);
    });

    it('should update an assessment', async () => {
        const asmnt = await asmntService.update({ name: 'new name!', _id: '60252e8d2115cc55844aabd1' });
        expect(asmnt.name).toBe('new name!');
    });

    it('should insert an assessment', async () => {
        const asmnt = await asmntService.add({ name: 'new asmnt!', attachments: [] });
        expect(asmnt._id).toBeTruthy();
        expect(asmnt.createdAt).toBeTruthy();
        expect(asmnt.updatedAt).toBeTruthy();
    });

    it('should remove an assessment', async () => {
        const id = await asmntService.remove('60252e8d2115cc55844aabd2');
        expect(id).toBe('60252e8d2115cc55844aabd2');

        const asmnt = await asmntService.getById(id);
        expect(asmnt.removedAt).toBeTruthy();
    });

    it('should update an assessment status to released', async () => {
        const asmnt = await asmntService.updateStatus('60252e8d2115cc55844aabd2', 'released');
        expect(asmnt.status).toBe('released');
        expect(asmnt.approvedAt).toBeTruthy();
        expect(asmnt.riskMatData).toBeTruthy();
    });

    it('should update an assessment status to pending', async () => {
        const asmnt = await asmntService.updateStatus('60252e8d2115cc55844aabd1', 'pending');
        expect(asmnt.status).toBe('pending');
        expect(asmnt.dateSubmitted).toBeTruthy();
    });
});