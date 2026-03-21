import axiosInstance from "./axios";

const LANGUAGE_VERSIONS = {
  javascript: { languageId: 63 },
  python: { languageId: 71 },
  java: { languageId: 62 },
};

/**
 * @param {string} language - programming language
 * @param {string} code - source code to executed
 * @returns {Promise<{success:boolean, output?:string, error?: string}>}
 */
export async function executeCode(language, code) {
  try {
    const languageConfig = LANGUAGE_VERSIONS[language];

    if (!languageConfig) {
      return {
        success: false,
        error: `Unsupported language: ${language}`,
      };
    }

    const { data } = await axiosInstance.post("/code/execute", {
        language_id: languageConfig.languageId,
        source_code: code,
    });
    const output = data.stdout || "";
    const stderr = data.stderr || data.compile_output || data.message || "";

    if (stderr) {
      return {
        success: false,
        output: output,
        error: stderr,
      };
    }

    return {
      success: true,
      output: output || "No output",
    };
  } catch (error) {
    const backendMessage =
      error?.response?.data?.details?.message ||
      error?.response?.data?.message ||
      error?.message;

    return {
      success: false,
      error: `Failed to execute code: ${backendMessage}`,
    };
  }
}