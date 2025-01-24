/* eslint-disable no-useless-catch */
import { cloneDeep } from "lodash";
import { boardModel } from "~/models/boardModel";
import { cardModel } from "~/models/cardModel";
import { columnModel } from "~/models/columnModel";
import { templateModel } from "~/models/templateModel";
import { userModel } from "~/models/userModel";
import { slugify } from "~/utils/formatters";

const createNewTemplate = async (templateData) => {
  try {
    const newTemplate = {
      ...templateData,
      createdAt: new Date(),
      updatedAt: null,
    };
    const createdTemplate = await templateModel.createTemplate(newTemplate);
    return createdTemplate;
  } catch (error) {
    throw error;
  }
};

const fetchTemplates = async () => {
  try {
    const templates = await templateModel.getTemplates();
    const result = templates.map(async (template) => {
      const user = await userModel.findOneById(template.userId);
      return {
        ...template,
        avatar: user.avatar,
        displayName: user.displayName,
      };
    });
    return Promise.all(result);
  } catch (error) {
    throw error;
  }
};

const fetchTemplateDetails = async (templateId) => {
  try {
    const template = await templateModel.getTemplateById(templateId);
    if (!template) {
      throw new Error("Template not found");
    }
    return template;
  } catch (error) {
    throw error;
  }
};

const removeTemplate = async (templateId) => {
  try {
    const deletedTemplate = await templateModel.deleteTemplate(templateId);
    if (!deletedTemplate.deletedCount) {
      throw new Error("Template not found");
    }
    return deletedTemplate;
  } catch (error) {
    throw error;
  }
};

const updateTemplateDetails = async (templateId, templateData) => {
  try {
    const updatedTemplate = await templateModel.updateTemplateDetails(
      templateId,
      templateData
    );
    if (!updatedTemplate.value) {
      throw new Error("Template not found");
    }
    return updatedTemplate.value;
  } catch (error) {
    throw error;
  }
};
const cloneTemplate = async (templateId, userId) => {
  try {
    const template = await templateModel.findOnebyId(templateId);
    if (!template) {
      throw new Error("Template not found");
    }

    // Sao chép template
    let cloneTemplate = cloneDeep(template);
    const newBoard = {
      title: cloneTemplate.title,
      description: cloneTemplate.description,
      type: cloneTemplate.type || "public",
      background: cloneTemplate.background,
      slug: slugify(cloneTemplate.title),
    };

    // Tạo board mới
    const createdBoard = await boardModel.createNew(userId, newBoard);
    const boardId = createdBoard.insertedId.toString();

    // Duyệt qua các column trong template theo thứ tự
    for (const column of cloneTemplate.columns) {
      const dataColumn = {
        title: column.title,
        boardId: boardId,
      };

      // Tạo column mới
      const createdColumn = await columnModel.createNew(dataColumn);
      const columnId = createdColumn.insertedId.toString();

      // Thêm columnId vào columnOrderIds theo thứ tự
      await boardModel.pushColumnOrderIds({ _id: columnId, boardId: boardId });

      // Duyệt qua các card trong column theo thứ tự
      for (const card of column.cards) {
        const dataCard = {
          title: card.title,
          description: card.description,
          cover: card.cover,
          columnId: columnId,
          boardId: boardId,
        };

        // Tạo card mới
        const cardNew = await cardModel.createNew(dataCard);
        const cardId = cardNew.insertedId.toString();

        // Thêm cardId vào cardOrderIds theo thứ tự
        await columnModel.pushCardOrderIds({
          _id: cardId,
          columnId: columnId,
        });
      }
    }

    return boardId;
  } catch (error) {
    console.error("Error in cloneTemplate:", error);
    throw error;
  }
};

export const templatesService = {
  createNewTemplate,
  fetchTemplates,
  fetchTemplateDetails,
  removeTemplate,
  updateTemplateDetails,
  cloneTemplate,
};
