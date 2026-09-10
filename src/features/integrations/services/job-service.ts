import { JobRepository } from "../repositories/job-repository";
import { JobStatus } from "@prisma/client";

export class JobService {
  private repository = new JobRepository();

  async getJobs(params: any) {
    return this.repository.getJobs(params);
  }

  async getJobDetails(id: string) {
    return this.repository.getJobById(id);
  }

  async retryJob(id: string) {
    const job = await this.repository.getJobById(id);
    if (!job) throw new Error("Job not found");

    return this.repository.updateJob(id, {
      status: "RETRYING",
      attempts: { increment: 1 },
      nextRunAt: new Date(),
    });
  }

  async cancelJob(id: string) {
    return this.repository.updateJob(id, {
      status: "CANCELLED",
    });
  }

  async getScheduledTasks() {
    return this.repository.getScheduledTasks();
  }

  async toggleScheduledTask(id: string, isEnabled: boolean) {
    return this.repository.updateScheduledTask(id, { isEnabled });
  }
}
