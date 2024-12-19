import { Test, TestingModule } from '@nestjs/testing';
import { IssuesService } from './issues.service';
import { Issue } from './issues.entity';
import { UtilsService } from '../utils/utils.service';
import { getRepositoryToken } from '@nestjs/typeorm';

const oneIssue: Partial<Issue> = {
  description: 'Lorem ipsum dolor sit amet.',
  notes: 'Lorem ipsum dolor sit amet.',
  user: { id_user: 1 } as any,
  technician: { id_user: 3 } as any,
  status: { id_status: 1 } as any,
  fk_inventari: { id_inventory: 1 } as any,
  conversations: [],
};

const mockIssueUpdate: Partial<Issue> = {
  description: 'Lorem ipsum dolor sit amet.',
  notes: 'Updated notes.',
  user: { id_user: 1 } as any,
  technician: { id_user: 3 } as any,
  status: { id_status: 1 } as any,
  fk_inventari: { id_inventory: 1 } as any,
  conversations: [],
};

describe('IssuesService', () => {
  let issuesService: IssuesService;

  const MockIssueRepository = {
    find: jest.fn(() => [{ ...oneIssue, id_issue: 1 }]),
    findOne: jest.fn(() => ({ ...oneIssue, id_issue: 1 })),
    create: jest.fn((issue: Partial<Issue>) => ({
      ...oneIssue,
      ...issue,
      id_issue: 1,
    })),
    save: jest.fn((issue: Partial<Issue>) => ({
      ...oneIssue,
      ...issue,
      id_issue: 1,
    })),
    update: jest.fn(() => Promise.resolve()),
    findOneBy: jest.fn((criteria) => {
      if (criteria.id_issue === 1) {
        return Promise.resolve({
          ...oneIssue,
          ...mockIssueUpdate,
          id_issue: 1,
        });
      }
      return Promise.resolve(null);
    }),
    delete: jest.fn(() => Promise.resolve({ affected: 1 })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IssuesService,
        UtilsService,
        {
          provide: getRepositoryToken(Issue),
          useValue: MockIssueRepository,
        },
      ],
    }).compile();

    issuesService = module.get<IssuesService>(IssuesService);
  });

  it('should be defined', () => {
    expect(issuesService).toBeDefined();
  });

  describe('createIssue', () => {
    it('should create a new issue item', async () => {
      const result = await issuesService.createIssue(oneIssue as Issue);
      expect(result).toEqual(
        expect.objectContaining({ ...oneIssue, id_issue: 1 }),
      );
      expect(MockIssueRepository.create).toHaveBeenCalledWith(oneIssue);
      expect(MockIssueRepository.save).toHaveBeenCalled();
    });
  });

  describe('updateIssue', () => {
    it('should update an issue item', async () => {
      const result = await issuesService.updateIssue(
        1,
        mockIssueUpdate as Issue,
      );
      expect(MockIssueRepository.update).toHaveBeenCalledWith(
        1,
        mockIssueUpdate,
      );
      expect(MockIssueRepository.findOneBy).toHaveBeenCalledWith({
        id_issue: 1,
      });
      expect(result).toEqual(
        expect.objectContaining({
          ...oneIssue,
          ...mockIssueUpdate,
          id_issue: 1,
        }),
      );
    });
  });

  describe('getAllIssues', () => {
    it('should return an array of issues', async () => {
      const result = await issuesService.getAllIssues('false');
      expect(result).toEqual([
        expect.objectContaining({ ...oneIssue, id_issue: 1 }),
      ]);
    });
  });

  describe('getIssue', () => {
    it('should return a specific issue by ID', async () => {
      MockIssueRepository.findOneBy.mockResolvedValueOnce({
        ...oneIssue,
        id_issue: 1,
      });
      const result = await issuesService.getIssue(1, 'false');
      expect(result).toEqual(
        expect.objectContaining({ ...oneIssue, id_issue: 1 }),
      );
      expect(MockIssueRepository.findOneBy).toHaveBeenCalledWith({
        id_issue: 1,
      });
    });
  });

  describe('deleteIssue', () => {
    it('should delete an issue successfully', async () => {
      const result = await issuesService.deleteIssue(1);
      expect(MockIssueRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });
});
