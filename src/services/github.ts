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

import { b64_to_utf8, jsonParse } from '@/utils/utils';
import api from './api';

export const getDataFromGitHub = async ({
  owner,
  repo,
  path,
}: Partial<Record<'owner' | 'repo' | 'path', string>>) => {
  if (owner && repo && path) {
    const res = await api<GithubContents>(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    );

    return {
      ...res,
      result: res.result && {
        ...res.result,
        content:
          res.result.encoding === 'base64'
            ? jsonParse(b64_to_utf8(res.result.content), [])
            : res.result.content,
      },
    };
  } else {
    return {
      success: false,
      msg: '缺少参数',
      result: null,
    };
  }
};
