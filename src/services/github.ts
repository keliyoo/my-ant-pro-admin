// /repos/{owner}/{repo}/contents/{path}

export type GithubContents = {
  type: 'file';
  encoding: 'base64';
  size: number;
  name: string;
  path: string;
  content: string;
  sha: string;
  url: string;
  git_url: string;
  html_url: string;
  download_url: string;
  _links: {
    git: string;
    self: string;
    html: string;
  };
};

import { b64_to_utf8, jsonParse, utf8_to_b64 } from '@/utils/utils';
import api, { RequestResult } from './api';

export const getDataFromGitHub = async ({
  owner,
  repo,
  path,
}: Partial<Record<'owner' | 'repo' | 'path', string>>): Promise<
  RequestResult<
    Omit<GithubContents, 'content'> & {
      content: Record<string, any>[];
    }
  >
> => {
  if (owner && repo && path) {
    const res = await api<GithubContents>(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    );

    if (res.success) {
      return {
        ...res,
        result: res.result && {
          ...res.result,
          content:
            res.result.encoding === 'base64'
              ? jsonParse(b64_to_utf8(res.result.content), [])
              : [],
        },
      };
    }

    return res;
  } else {
    return {
      success: false,
      msg: '缺少参数',
      result: null,
    };
  }
};

// https://api.github.com/repos/{user}/imgs/contents/{path}/{filename}
export const putDataToGitHub = async ({
  owner,
  repo,
  path,
  data,
}: Partial<Record<'owner' | 'repo' | 'path', string>> & {
  data: any;
}): Promise<RequestResult> => {
  console.log(1, owner, repo, path, data, utf8_to_b64(JSON.stringify(data)));

  if (owner && repo && path) {
    const res = await api(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        method: 'put',
        body: utf8_to_b64(JSON.stringify(data)),
        headers: {
          accept: 'application/vnd.github+json',
        },
      },
    );

    return res;
  } else {
    return {
      success: false,
      msg: '缺少参数',
      result: null,
    };
  }
};
