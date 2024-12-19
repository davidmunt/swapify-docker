import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UtilsService } from '../utils/utils.service';
import { IssueConversationEntity } from './issues_conversation.entity';
import { IssueConversationService } from './issues_conversation.service';

const conversationArray = [
  {
    id_conversation: 1,
    id_issue: 1,
    id_user: 1,
    notes: 'test de prueba 1',
    create_at: '',
  },
  {
    id_conversation: 2,
    id_issue: 1,
    id_user: 1,
    notes: 'test de prueba 2',
    create_at: '',
  },

  {
    id_conversation: 3,
    id_issue: 1,
    id_user: 1,
    notes: 'test de prueba 3',
    create_at: '',
  },
];

const oneConversation = {
  id_conversation: 4,
  id_issue: 1,
  id_user: 1,
  notes: 'test de prueba 4',
  create_at: '',
};

const updateConversation = {
  id_conversation: 1,
  notes: 'Update realizado',
};

const deleteConversation = {
  id_conversation: 2,
  id_issue: 1,
  id_user: 1,
  notes: 'test de prueba 2',
  create_at: '',
};

describe('IssueConversationService', () => {
  let conversationService: IssueConversationService;
  const MockConversationRepository = {
    find: jest.fn(() => conversationArray),
    findOneBy: jest.fn((conditions) => {
      if (conditions.id_conversation === updateConversation.id_conversation) {
        return updateConversation;
      }
      return oneConversation;
    }),
    create: jest.fn(() => oneConversation),
    findOne: jest.fn(() => oneConversation),
    delete: jest.fn(() => deleteConversation),
    save: jest.fn((conversation) => conversation),
    merge: jest.fn((existing, updates) => ({ existing, updates })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IssueConversationService,
        UtilsService,
        {
          provide: getRepositoryToken(IssueConversationEntity),
          useValue: MockConversationRepository,
        },
      ],
    }).compile();

    conversationService = module.get<IssueConversationService>(
      IssueConversationService,
    );
  });

  it('should be defined', () => {
    expect(conversationService).toBeDefined();
  });

  describe('createIssueConversation', () => {
    it('should create a new conversation', async () => {
      const mockConversation = {
        id_conversation: 4,
        id_issue: 1,
        id_user: 1,
        notes: 'test de prueba 4',
        create_at: '',
      };
      const result =
        await conversationService.createIssueConversation(mockConversation);

      expect(result).toMatchObject(mockConversation);
    });
  });

  describe('getIssueConversation', () => {
    it('should return an array of conversations when xml is not provided', async () => {
      const result = await conversationService.getIssueConversation(1, 'false');
      expect(typeof result).toBe('object');
    });
  });

  describe('getIssueConversation', () => {
    it('should return an XML string when xml is set to "true"', async () => {
      const result = await conversationService.getIssueConversation(1, 'true');
      expect(typeof result).toBe('string');
    });
  });

  describe('updateIssueConversation', () => {
    it('should update a conversation', async () => {
      const mockConversation = {
        id_conversation: 1,
        notes: 'Update realizado',
      };

      const result = await conversationService.updateIssueConversation(
        mockConversation.id_conversation,
        mockConversation.notes,
      );

      expect(result).toMatchObject(mockConversation);
    });
  });

  describe('deleteIssueConversation', () => {
    it('should delete a conversation successfully', async () => {
      const mockDeleteResponse = { message: 'Conversacion eliminada' };
      jest
        .spyOn(conversationService, 'deleteIssueConversation')
        .mockResolvedValue(mockDeleteResponse);

      const result = await conversationService.deleteIssueConversation(1);
      expect(result).toEqual(mockDeleteResponse);
      expect(conversationService.deleteIssueConversation).toHaveBeenCalledWith(
        1,
      );
    });
  });
});
