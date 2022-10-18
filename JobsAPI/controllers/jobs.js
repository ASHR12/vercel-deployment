const job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors/index");

const getAllJobs = async (req, res) => {
  const result = await job
    .find({ createdBy: req.user.userId })
    .sort("createdAt");
  res.send({ nbHits: result.length, result });
};
// return single job by id
const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const result = await job.findOne({ _id: jobId, createdBy: userId });
  if (!result) {
    throw new NotFoundError(`No Job found with ID ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ result });
};

const createJob = async (req, res) => {
  // we are adding createdBy property to req.body
  // company,position and other filed should come in request submission
  req.body.createdBy = req.user.userId;
  const result = await job.create(req.body);
  res.status(StatusCodes.CREATED).json({ result });
};

const updateJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
    body: { company, position },
  } = req;
  if (company === "" || position === "") {
    throw new BadRequestError(`company or position can not be empty `);
  }
  const result = await job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!result) {
    throw new NotFoundError(`No Job found with ID ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ result });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const result = await job.findOneAndDelete({ _id: jobId, createdBy: userId });
  if (!result) {
    throw new NotFoundError(`No Job found with ID ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ result });
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
