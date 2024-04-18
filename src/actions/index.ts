"use server";

import axiosInstance from "@/lib/axios";

const API_URL = {
  GET_ALL_FILE: `/file/all`,
  NEW_FILE: `/file/new`,
  UPDATE_FILE: `/file/update`,
  DELETE_FILE: `/file/delete`,
  LOGIN: `/user`,
  START_SANDBOX: `/sandbox/start`,
};

interface APIResponse {
  success: boolean;
  message?: string;
}

interface GetAllResponse extends APIResponse {
  data?: IFile[];
}

interface FileResponse extends APIResponse {
  data?: IFile;
}

interface FileResponse extends APIResponse {
  data?: IFile;
}

interface UserResponse extends APIResponse {
  data?: IUser;
}

interface SandboxResponse extends APIResponse {
  data?: {
    port: string;
  };
}

export const getAllFiles = async () => {
  try {
    const { data: response }: { data: GetAllResponse } =
      await axiosInstance.get(API_URL.GET_ALL_FILE);

    if (response.success) {
      return response.data || [];
    }

    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const createNewFile = async (
  name: string,
  content: string,
  extension: string,
) => {
  try {
    const file = { name, content, extension };

    const { data: response }: { data: FileResponse } = await axiosInstance.post(
      API_URL.NEW_FILE,
      {
        file,
      },
    );

    if (!response.success) {
      return false;
    }

    return response?.data?._id;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const updateFile = async (
  _id: string,
  name: string,
  content: string,
  extension: string,
) => {
  try {
    const file = { _id, name, content, extension };
    const { data: response }: { data: FileResponse } = await axiosInstance.put(
      API_URL.UPDATE_FILE,
      { file },
    );

    if (!response.success) {
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const login = async (email: string) => {
  try {
    const { data: response }: { data: UserResponse } = await axiosInstance.post(
      API_URL.LOGIN,
      { email },
    );
    if (!response.success) {
      return null;
    }
    console.log(response);

    return response?.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const startSandbox = async (email: string) => {
  try {
    const { data: response }: { data: SandboxResponse } =
      await axiosInstance.get(API_URL.START_SANDBOX);

    if (!response.success) {
      return null;
    }
    return response?.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
