// 全局共享数据示例
import { LEGADO_BOOK_SOURCE_ACCESS } from '@/constants';
import { getDataFromGitHub, putDataToGitHub } from '@/services/github';
import { isEmptyObject } from '@/utils/utils';
import { useModel } from '@umijs/max';
import { message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { LooseObject } from 'typings';

export const useFormListKeys = [
  'ruleSearch',
  'ruleExplore',
  'ruleBookInfo',
  'ruleToc',
  'ruleContent',
];

export const exploreUrlStyleKeys = [
  'layout_flexGrow',
  'layout_flexShrink',
  'layout_alignSelf',
  'layout_flexBasisPercent',
  'layout_wrapBefore',
];

const useLegado = () => {
  const { initialState } = useModel('@@initialState');

  console.log('initialState', initialState);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LooseObject[] | undefined>(undefined);
  const [maxId, setMaxId] = useState<number>(0);

  useEffect(() => {
    let useEffectUnMountFlag = false;

    const getData = async () => {
      if (!initialState) {
        setLoading(false);
        setData(undefined);
        setMaxId(0);
        return;
      }

      setLoading(true);
      const res = await getDataFromGitHub({
        ...initialState,
        path: initialState[LEGADO_BOOK_SOURCE_ACCESS],
      });

      if (useEffectUnMountFlag) {
        return;
      }
      console.log('res', JSON.parse(JSON.stringify(res)));

      setLoading(false);
      if (res.success) {
        const data = res.result.content;

        let maxId = Math.max(
          ...data.map((item) => {
            return Number.isFinite(+item.id) ? +item.id : 0;
          }),
        );

        data.forEach((item) => {
          useFormListKeys.forEach((v) => {
            if (item[v]) {
            }
            item[v] = item[v]?.[0] || undefined;
          });

          if (item.exploreUrl) {
            item.exploreUrl = item.exploreUrl.map((v: any) => {
              if (v.style) {
                const { style, ...otherV } = v;
                return { ...otherV, ...style };
              }
              return v;
            });
          }

          item.id = Number.isFinite(+item.id) ? +item.id : ++maxId;
          return item;
        });

        setData(data);
        setMaxId(maxId);
      } else {
        setData(undefined);
        setMaxId(0);
        message.error(res.msg);
      }
    };

    getData();

    return () => {
      useEffectUnMountFlag = true;
    };
  }, [initialState]);

  const putData = useCallback(
    (params: LooseObject) => {
      if (!data || !initialState) {
        return;
      }
      let isAddFalg = false;

      let newData = data.map((v) => {
        if (v.id === params.id) {
          isAddFalg = true;
          return params;
        }
        return v;
      });
      if (isAddFalg) {
        newData.push(params);
      }

      newData = data.map((item) => {
        useFormListKeys.forEach((v) => {
          if (item[v]) {
            item[v] =
              !item[v][0] || isEmptyObject(item[v][0]) ? undefined : item[v][0];
          }
        });

        if (item.exploreUrl) {
          item.exploreUrl.forEach((urls: any) => {
            exploreUrlStyleKeys.forEach((v) => {
              if (urls[v]) {
                if (urls.style) {
                  urls.style[v] = urls[v];
                } else {
                  item.style = { [v]: urls[v] };
                }
                urls[v] = undefined;
              }
            });
          });
        }

        return item;
      });

      console.log('newData', newData);

      putDataToGitHub({
        ...initialState,
        path: initialState[LEGADO_BOOK_SOURCE_ACCESS],
        data: newData,
      });
    },
    [data],
  );

  return {
    loading,
    data,
    maxId,
    putData,
  };
};

export default useLegado;
