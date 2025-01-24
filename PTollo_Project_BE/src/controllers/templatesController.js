import { StatusCodes } from "http-status-codes";
import { templatesService } from "~/services/templateService";

const createTemplate = async (req, res, next) => {
  try {
    const newTemplate = await templatesService.createNewTemplate(req.body);
    res.status(StatusCodes.CREATED).json(newTemplate);
  } catch (err) {
    next(err);
  }
};

const getTemplates = async (req, res, next) => {
  try {
    const templates = await templatesService.fetchTemplates();
    res.status(StatusCodes.OK).json(templates);
  } catch (err) {
    next(err);
  }
};

const getTemplateDetails = async (req, res, next) => {
  try {
    const template = await templatesService.fetchTemplateDetails(req.params.id);
    res.status(200).json(template);
  } catch (err) {
    next(err);
  }
};

const deleteTemplate = async (req, res, next) => {
  try {
    await templatesService.removeTemplate(req.params.id);
    res.status(200).json({ message: "Template deleted successfully" });
  } catch (err) {
    next(err);
  }
};
const updateTemplateDetails = async (req, res, next) => {
  try {
    const updatedTemplate = await templatesService.updateTemplateDetails(
      req.params.id,
      req.body
    );
    res.status(StatusCodes.OK).json(updatedTemplate);
  } catch (err) {
    next(err);
  }
};
const cloneTemplate = async (req, res, next) => {
  try {
    const templateId = req.params.id;
    const userId = req.jwtDecoded._id;
    const newTemplate = await templatesService.cloneTemplate(
      templateId,
      userId
    );
    res.status(StatusCodes.CREATED).json(newTemplate);
  } catch (err) {
    next(err);
  }
};
export const templatesController = {
  createTemplate,
  getTemplates,
  getTemplateDetails,
  deleteTemplate,
  updateTemplateDetails,
  cloneTemplate,
};
