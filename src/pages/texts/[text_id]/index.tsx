import CheckIcon from '@mui/icons-material/Check';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import UpdateIcon from '@mui/icons-material/Update';
import { Box, CircularProgress, colors, Grid, Rating, Stack, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/router';
import { useCallback, useContext, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import { getChapterList } from 'api/getChapterList';
import { getPurchasedInfo } from 'api/getPurchasedInfo';
import { getReviews } from 'api/getReviews';
import { getText } from 'api/getText';
import { getUser } from 'api/getUser';
import { getUserTexts } from 'api/getUserTexts';
import { getViewText } from 'api/getViewText';
import { purchaseText } from 'api/purchaseText';
import AuthorTexts from 'components/AuthorTexts';
import AvatarButton from 'components/AvatarButton';
import CenterLoadingSpinner from 'components/CenterLoadingSpinner';
import RatingReportPanel from 'components/RatingReportPanel';
import ReadMoreText from 'components/ReadMoreText';
import Review from 'components/ReviewItem';
import ShowMore from 'components/ShowMore';
import { AuthContext } from 'components/auth/AuthContext';
import ViewTextAbstractLayout from 'components/layouts/ViewTextAbstractLayout';
import chapters from 'pages/api/texts/[text_id]/chapters';
import Consts from 'utils/Consts';
import { extractToc } from 'utils/extractToc';

import type { NextPage } from 'next';

const Text: NextPage = () => {
  const { authAxios } = useContext(AuthContext);
  const { mutate } = useSWRConfig();
  const [bannerHeight, setBannerHeight] = useState();

  const [isPurchaseProcessing, setPurchaseProcessing] = useState(false);

  const router = useRouter();
  const textId = router.query.text_id;

  const mq = useMediaQuery('(min-width:1000px)');

  const ref = useCallback((node) => {
    if (node) {
      setBannerHeight(node.clientHeight);
    }
  }, []);

  const { data, error } = useSWR(`texts/${textId}`, () => getText(textId), {
    revalidateOnFocus: false,
  });

  const { data: dataAuthor, error: errorAuthor } = useSWR(
    data ? `users/${data.author_id}` : null,
    () => getUser(data.author_id),
    {
      revalidateOnFocus: false,
    },
  );

  const { data: dataAuthorTexts, error: errorAuthorTexts } = useSWR(
    data ? `users/${data.author_id}/texts` : null,
    () => getUserTexts(data.author_id, 0),
    {
      revalidateOnFocus: false,
    },
  );

  const { data: dataPurchasedInfo, error: errorPurchasedInfo } = useSWR(
    `texts/${textId}/purchase`,
    () => getPurchasedInfo(textId, authAxios),
    {
      revalidateOnFocus: false,
    },
  );

  const { data: dataReviews, error: errorReviews } = useSWR(
    `texts/${textId}/reviews`,
    () => getReviews(textId, null, authAxios),
    {
      revalidateOnFocus: false,
    },
  );

  if (error) {
    return <>error</>;
  }
  if (errorPurchasedInfo) console.log(errorPurchasedInfo);
  if (!data || !dataPurchasedInfo) return <CenterLoadingSpinner />;

  const learningContents = data.learning_contents == null ? [] : JSON.parse(data.learning_contents);
  const learningRequirements =
    data.learning_requirements == null ? [] : JSON.parse(data.learning_requirements);

  const handleReadTextClick = async () => {
    router.push(`/texts/${router.query.text_id}/view`);
  };

  const handleReviewListClick = async () => {
    router.push(`/texts/${textId}/reviews`);
  };

  const handlePurchaseClick = async () => {
    setPurchaseProcessing(true);
    const { status, error } = await purchaseText(textId, authAxios);

    if (error) {
      console.log(error);
    } else if (status == 'ok') {
      mutate(`texts/${textId}/purchase`);
    }
    setPurchaseProcessing(false);

    return;
  };

  const handleWriteReviewClick = () => {
    router.push(`/texts/${router.query.text_id}/reviews/edit`);
  };

  const handleAuthorClick = () => {
    router.push(`/users/${data.author_id}`);
  };

  const handleReviewerClick = (id) => {
    router.push(`/users/${id}`);
  };

  const PanelButtonThin = ({ ml, onClick, colors, children }) => {
    return (
      <Box
        variant='contained'
        onClick={onClick}
        sx={{
          ml: ml,
          p: 0.5,
          width: '130px',
          display: 'block',
          fontWeight: 'bold',
          fontSize: '0.9em',
          my: 'auto',
          backgroundColor: colors.backGround,
          color: colors.text,
          border: '2px solid ' + colors.border,
          textAlign: 'center',
          '&:hover': {
            backgroundColor: colors.hoverBackground,
            borderColor: colors.hoverBorder,
            cursor: 'pointer',
          },
        }}
      >
        {children}
      </Box>
    );
  };

  const PanelButton = ({ mt, onClick, colors, children }) => {
    return (
      <Box
        variant='contained'
        onClick={onClick}
        sx={{
          mt: mt,
          width: '95%',
          display: 'block',
          fontWeight: 'bold',
          fontSize: '1.0em',
          mx: 'auto',
          backgroundColor: colors.backGround,
          color: colors.text,
          border: '2px solid ' + colors.border,
          textAlign: 'center',
          p: 1,
          '&:hover': {
            backgroundColor: colors.hoverBackground,
            borderColor: colors.hoverBorder,
            cursor: 'pointer',
          },
        }}
      >
        {children}
      </Box>
    );
  };

  const COLOR_PURPLE = '#aaaaff';
  const COLOR_BANNER = '#1c1d1f';
  const COLOR_BANNER_TEXT = '#ffffff';

  const imageUrl = data.photo_id
    ? Consts.IMAGE_STORE_URL + data.photo_id + '.png'
    : '/cover-default.svg';

  const bannerBackgroundHeight = bannerHeight + 60 + 'px';

  const abstract = data.abstract == null ? '' : data.abstract.substring(0, 150);
  const padding = ''.padStart(150 - abstract.length, '　');

  const Reviews = () => {
    if (!dataReviews) return <CenterLoadingSpinner />;

    const reviews = JSON.parse(JSON.stringify(dataReviews.reviews)); // deep copy
    const displayNum = 5;
    const more = dataReviews.reviews.length > displayNum;

    reviews.splice(displayNum);

    return (
      <Box sx={{ p: 1, width: '100%' }}>
        {reviews.map((item) => {
          return <Review review={item} onUserClick={() => handleReviewerClick(item.user_id)} />;
        })}
        {more && <ShowMore onClick={handleReviewListClick}>全てのレビューを参照</ShowMore>}
      </Box>
    );
  };

  const Author = () => {
    if (!dataAuthor) return <CenterLoadingSpinner />;

    return (
      <>
        <Box
          onClick={handleAuthorClick}
          component='span'
          sx={{
            textDecoration: 'underline',
            fontSize: '1.3em',
            fontWeight: 'bold',
            color: Consts.COLOR.Primary,
            cursor: 'pointer',
            '&:hover': { color: Consts.COLOR.PrimaryDark },
          }}
        >
          {dataAuthor.display_name}
        </Box>
        <Box sx={{ color: '#666666' }}>{dataAuthor.majors}</Box>

        <Box sx={{ width: '100%', display: 'flex', mt: 1 }}>
          <AvatarButton photoId={dataAuthor.photo_id} onClick={handleAuthorClick} size={100} />

          <Box sx={{ ml: 2, fontSize: '0.9em' }}>
            <Box sx={{ display: 'flex', width: '100%' }}>
              <Box sx={{ my: 'auto' }}>
                <MenuBookIcon sx={{ transform: 'scale(0.8)' }} />
              </Box>
              <Box
                sx={{
                  my: 'auto',
                  ml: 1,
                }}
              >
                テキスト数: {dataAuthor.num_of_texts}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', width: '100%' }}>
              <Box sx={{ my: 'auto' }}>
                <PeopleIcon sx={{ transform: 'scale(0.8)' }} />
              </Box>
              <Box
                sx={{
                  my: 'auto',
                  ml: 1,
                }}
              >
                読者数: {dataAuthor.num_of_sales}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', width: '100%' }}>
              <Box sx={{ my: 'auto' }}>
                <StarIcon sx={{ transform: 'scale(0.8)' }} />
              </Box>
              <Box
                sx={{
                  my: 'auto',
                  ml: 1,
                }}
              >
                レビュー数: {dataAuthor.num_of_reviews}
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ width: '100%', mt: 1.5 }}>
          <ReadMoreText height='200' fontSize='0.9em'>
            {dataAuthor.profile_message}
          </ReadMoreText>
        </Box>
      </>
    );
  };

  const ReviewWriteButton = () => {
    if (!dataReviews) {
      return <></>;
    }

    console.log(dataReviews);
    return (
      <PanelButton
        mt={1}
        onClick={handleWriteReviewClick}
        colors={{
          backGround: Consts.COLOR.Primary,
          border: Consts.COLOR.Primary,
          text: '#ffffff',
          hoverBackground: Consts.COLOR.PrimaryDark,
          hoverBorder: Consts.COLOR.PrimaryDark,
        }}
      >
        レビューを{dataReviews.is_mine_exists ? '編集する' : '書く'}
      </PanelButton>
    );
  };

  if (mq) {
    return (
      <>
        <Box
          sx={{
            background: `linear-gradient(180deg, ${COLOR_BANNER} 0px, ${COLOR_BANNER} ${bannerBackgroundHeight}, ${COLOR_BANNER} ${bannerBackgroundHeight}, #ffffff ${bannerBackgroundHeight})`,
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Box sx={{ p: 2, mt: 2, minWidth: '800px', width: 'calc(60% - 210px)' }}>
            <Box ref={ref}>
              <Box sx={{ color: COLOR_BANNER_TEXT }}>
                <h1>{data.title}</h1>
                <Box sx={{ fontSize: '1.3em' }}>{abstract}</Box>
              </Box>
              <Box sx={{ display: 'flex', width: '100%', mt: 1.5 }}>
                <Box sx={{ cursor: 'pointer', display: 'flex' }}>
                  <Box sx={{ fontWeight: 'bold', color: '#faaf00', my: 'auto', fontSize: '0.9em' }}>
                    {data.rate}
                  </Box>

                  <Rating
                    sx={{ mt: 1, my: 'auto', ml: 0.5 }}
                    value={data.rate}
                    readOnly
                    size='small'
                    precision={0.5}
                    emptyIcon={
                      <StarBorderIcon
                        style={{ opacity: 0.55, color: '#ffd269' }}
                        fontSize='inherit'
                      />
                    }
                  />
                  <Box
                    onClick={handleReviewListClick}
                    sx={{
                      color: COLOR_PURPLE,
                      my: 'auto',
                      textDecoration: 'underline',
                      ml: 1,
                      fontSize: '0.9em',
                    }}
                  >
                    {data.number_of_reviews}件の評価
                  </Box>
                </Box>

                <Box sx={{ my: 'auto', ml: 2, color: COLOR_BANNER_TEXT, fontSize: '0.9em' }}>
                  販売数:{data.number_of_sales}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', width: '100%', mt: 0.6 }}>
                <Box sx={{ my: 'auto', color: COLOR_BANNER_TEXT, fontSize: '0.9em' }}>作成者:</Box>
                <Box
                  onClick={handleAuthorClick}
                  sx={{
                    my: 'auto',
                    ml: 0.4,
                    color: COLOR_PURPLE,
                    fontSize: '0.9em',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  {data.author_display_name}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', width: '100%', mt: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: COLOR_BANNER_TEXT,
                    fontSize: '0.9em',
                  }}
                >
                  <UpdateIcon sx={{ my: 'auto', transform: 'scale(0.9)' }} />
                </Box>
                <Box
                  sx={{
                    my: 'auto',
                    ml: 0.4,
                    color: '#fefefe',
                    fontSize: '0.9em',
                    alignItems: 'center',
                  }}
                >
                  {data.updated_at !== null && (
                    <span style={{ verticalAlign: 'middle' }}>
                      最終更新日：{new Date(data.updated_at).toLocaleString('jp')}
                    </span>
                  )}
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 6, p: 2, border: '1px solid #cccccc' }}>
              <Box sx={{ fontSize: '1.4em', fontWeight: 'bold' }}>学習内容</Box>

              <Grid container>
                {learningContents?.map((item) => {
                  return (
                    <Grid xs={6}>
                      <Box sx={{ display: 'flex', width: '100%', mt: 1 }}>
                        <Box sx={{ ml: 1, mb: 'auto', fontSize: '0.6em' }}>
                          <CheckIcon sx={{ transform: 'scale(0.7)' }} />
                        </Box>
                        <Box
                          sx={{
                            my: 'auto',
                            ml: 0.4,
                          }}
                        >
                          {item}
                        </Box>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>

            <Box sx={{ mt: 1, p: 2 }}>
              <Box sx={{ fontSize: '1.4em', fontWeight: 'bold' }}>対象・要件</Box>
              <Box sx={{ pl: 1, py: 1 }}>
                <ul className='learningRequirements'>
                  {learningRequirements?.map((item) => {
                    return <li>{item}</li>;
                  })}
                </ul>
              </Box>
            </Box>

            <Box sx={{ pl: 2 }}>
              <Box sx={{ fontSize: '1.4em', fontWeight: 'bold' }}>解説</Box>

              <Box sx={{ pl: 1, py: 1 }}>
                <ReadMoreText height='220' fontSize='0.9em'>
                  {data.explanation}
                </ReadMoreText>
              </Box>
            </Box>

            <Box sx={{ pl: 2 }}>
              <Box sx={{ fontSize: '1.4em', fontWeight: 'bold' }}>目次</Box>
              <Box sx={{ pl: 1, py: 1 }}>
                <ChapterList />
              </Box>
            </Box>

            <Box sx={{ pl: 2, mt: 2 }}>
              <Box sx={{ fontSize: '1.4em', fontWeight: 'bold' }}>著者</Box>
              <Box sx={{ px: 1 }}>
                <Author />
              </Box>
            </Box>

            <Box sx={{ pl: 2, mt: 3 }}>
              <Box sx={{ fontSize: '1.4em', fontWeight: 'bold' }}>読者からのレビュー</Box>
              <Box sx={{ pl: 1, py: 1 }}>
                <RatingReportPanel text={data} />
              </Box>
              <Reviews />
            </Box>

            <Box sx={{ pl: 2, mt: 3 }}>
              <Box sx={{ fontSize: '1.4em', fontWeight: 'bold' }}>著者によるその他のテキスト</Box>
              <Box sx={{ pl: 1, py: 1 }}>
                {dataAuthorTexts ? (
                  <AuthorTexts data={dataAuthorTexts} authorId={data.author_id} textId={textId} />
                ) : (
                  <CenterLoadingSpinner />
                )}
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              margin: 1,
              mt: 4,
              p: 0.2,
              width: '205px',
              height: '400px',
              position: 'sticky',
              top: '30px',
              backgroundColor: '#ffffff',
              boxShadow: '0 0 8px gray',
              border: '1px solid #fefefe',
            }}
          >
            <Box
              component='img'
              display='flex'
              sx={{
                mx: 'auto',
                mb: 1,
                width: { xs: 150, sm: 200 },
                height: { xs: 84, sm: 112 },
              }}
              src={imageUrl}
            />
            <Box sx={{ fontSize: '0.8em', fontWeight: 'bold', px: 0.5 }}>{data.title}</Box>
            {!dataPurchasedInfo.purchased && (
              <Box sx={{ fontSize: '2em', fontWeight: 'bold', pl: 1, height: '40px' }}>
                &yen;{data.price.toLocaleString()}
              </Box>
            )}
            {dataPurchasedInfo.purchased || dataPurchasedInfo.yours ? (
              <PanelButton
                mt={1}
                onClick={handleReadTextClick}
                colors={{
                  backGround: '#ffffff',
                  border: Consts.COLOR.Primary,
                  text: Consts.COLOR.Primary,
                  hoverBackground: Consts.COLOR.LightPrimarySelected,
                  hoverBorder: Consts.COLOR.PrimarySelected,
                }}
              >
                テキストを読む
              </PanelButton>
            ) : (
              <PanelButton
                onClick={handlePurchaseClick}
                colors={{
                  backGround: Consts.COLOR.Primary,
                  border: Consts.COLOR.Primary,
                  text: '#ffffff',
                  hoverBackground: Consts.COLOR.PrimaryDark,
                  hoverBorder: Consts.COLOR.PrimaryDark,
                }}
              >
                {isPurchaseProcessing ? (
                  <CircularProgress size={20} sx={{ color: 'white', p: 0, m: 0 }} />
                ) : (
                  <>テキストを購入</>
                )}
              </PanelButton>
            )}

            {dataPurchasedInfo.purchased && !dataPurchasedInfo.yours && <ReviewWriteButton />}

            {dataPurchasedInfo.yours && (
              <PanelButton
                mt={1}
                onClick={() => {
                  router.push(`/texts/${textId}/edit`);
                }}
                colors={{
                  backGround: Consts.COLOR.Primary,
                  border: Consts.COLOR.Primary,
                  text: '#ffffff',
                  hoverBackground: Consts.COLOR.PrimaryDark,
                  hoverBorder: Consts.COLOR.PrimaryDark,
                }}
              >
                編集
              </PanelButton>
            )}

            <Box sx={{ p: 0.5, mt: 1 }}>
              <Box sx={{ fontWeight: 'bold' }}>このテキストについて</Box>
              <Box sx={{ mt: 1 }}>初版：{new Date(data.created_at).toLocaleDateString('ja')}</Box>
            </Box>
          </Box>
        </Box>
      </>
    );
  } else {
    return (
      <>
        <Box sx={{ backgroundColor: COLOR_BANNER, width: '100%', p: { xs: 0.4, sm: 2 } }}>
          <Box sx={{ color: COLOR_BANNER_TEXT }}>
            <Box sx={{ fontSize: { xs: '2.0em', sm: '2.5em' }, fontWeight: 'bold' }}>
              {data.title}
            </Box>
            <Box display='flex'>
              <Box
                sx={{
                  fontSize: { xs: '1.0em', sm: '1.3em' },
                  mr: 2,
                  overflowWrap: 'break-word',
                  wordBreak: 'break-all',
                }}
              >
                <Box
                  component='img'
                  sx={{
                    float: 'right',
                    ml: 1,
                    backgroundColor: '#ffffff',
                    p: '2px',
                    width: { xs: 150, sm: 200 },
                    height: { xs: 84, sm: 112 },
                  }}
                  src={imageUrl}
                />
                {abstract + padding}
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', width: '100%', mt: 1.5 }}>
            <Box sx={{ cursor: 'pointer', display: 'flex' }}>
              <Box sx={{ fontWeight: 'bold', color: '#faaf00', my: 'auto', fontSize: '0.9em' }}>
                {data.rate}
              </Box>

              <Rating
                sx={{ mt: 1, my: 'auto', ml: 0.5 }}
                value={data.rate}
                readOnly
                size='small'
                precision={0.5}
                emptyIcon={
                  <StarBorderIcon style={{ opacity: 0.55, color: '#ffd269' }} fontSize='inherit' />
                }
              />
              <Box
                onClick={handleReviewListClick}
                sx={{
                  color: COLOR_PURPLE,
                  my: 'auto',
                  textDecoration: 'underline',
                  ml: 1,
                  fontSize: '0.9em',
                }}
              >
                {data.number_of_reviews}件の評価
              </Box>
            </Box>

            <Box sx={{ my: 'auto', ml: 2, color: COLOR_BANNER_TEXT, fontSize: '0.9em' }}>
              販売数:{data.number_of_sales}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', width: '100%', mt: 0.6 }}>
            <Box sx={{ my: 'auto', color: COLOR_BANNER_TEXT, fontSize: '0.9em' }}>作成者:</Box>
            <Box
              onClick={handleAuthorClick}
              sx={{
                my: 'auto',
                ml: 0.4,
                color: COLOR_PURPLE,
                fontSize: '0.9em',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              {data.author_display_name}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', width: '100%', mt: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: COLOR_BANNER_TEXT,
                fontSize: '0.9em',
              }}
            >
              <UpdateIcon sx={{ transform: 'scale(0.9)' }} />
            </Box>
            <Box
              sx={{
                my: 'auto',
                ml: 0.4,
                color: '#fefefe',
                fontSize: '0.9em',
                alignItems: 'center',
              }}
            >
              {data.updated_at !== null && (
                <span style={{ verticalAlign: 'middle' }}>
                  最終更新日：{new Date(data.updated_at).toLocaleString('jp')}
                </span>
              )}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            width: '100%',
            position: 'sticky',
            top: '-1px',
            left: '0px',
            p: { xs: 0.4, sm: 2 },
            border: 'none',
            backgroundColor: '#bbbbbb',
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              fontSize: '1.0em',
              fontWeight: 'bold',
              width: '100%',
            }}
          >
            {data.title}
          </Box>

          <Box sx={{ display: 'flex' }}>
            {!dataPurchasedInfo.purchased && (
              <Box sx={{ fontSize: '1.4em', fontWeight: 'bold' }}>
                &yen;{data.price?.toLocaleString()}
              </Box>
            )}
            {dataPurchasedInfo.purchased || dataPurchasedInfo.yours ? (
              <PanelButtonThin
                ml={'auto'}
                onClick={handleReadTextClick}
                colors={{
                  backGround: '#ffffff',
                  border: Consts.COLOR.Primary,
                  text: Consts.COLOR.Primary,
                  hoverBackground: Consts.COLOR.LightPrimarySelected,
                  hoverBorder: Consts.COLOR.PrimarySelected,
                }}
              >
                テキストを読む
              </PanelButtonThin>
            ) : (
              <PanelButtonThin
                onClick={handlePurchaseClick}
                ml={'auto'}
                colors={{
                  backGround: Consts.COLOR.Primary,
                  border: Consts.COLOR.Primary,
                  text: '#ffffff',
                  hoverBackground: Consts.COLOR.PrimaryDark,
                  hoverBorder: Consts.COLOR.PrimaryDark,
                }}
              >
                テキストを購入
              </PanelButtonThin>
            )}

            {dataPurchasedInfo.purchased && !dataPurchasedInfo.yours && (
              <PanelButtonThin
                ml={1}
                onClick={handleWriteReviewClick}
                colors={{
                  backGround: Consts.COLOR.Primary,
                  border: Consts.COLOR.Primary,
                  text: '#ffffff',
                  hoverBackground: Consts.COLOR.PrimaryDark,
                  hoverBorder: Consts.COLOR.PrimaryDark,
                }}
              >
                レビューを書く
              </PanelButtonThin>
            )}

            {dataPurchasedInfo.yours && (
              <PanelButtonThin
                ml={1}
                onClick={() => {
                  router.push(`/texts/${textId}/edit`);
                }}
                colors={{
                  backGround: Consts.COLOR.Primary,
                  border: Consts.COLOR.Primary,
                  text: '#ffffff',
                  hoverBackground: Consts.COLOR.PrimaryDark,
                  hoverBorder: Consts.COLOR.PrimaryDark,
                }}
              >
                編集
              </PanelButtonThin>
            )}
          </Box>
        </Box>

        <Box sx={{ m: { xs: 0.4, sm: 2 }, p: { xs: 0.4, sm: 2 }, border: '1px solid #cccccc' }}>
          <Box sx={{ fontSize: '1.4em', fontWeight: 'bold' }}>学習内容</Box>

          <Grid container>
            {learningContents?.map((item) => {
              return (
                <Grid xs={6}>
                  <Box sx={{ display: 'flex', width: '100%', mt: { xs: 0, sm: 1 } }}>
                    <Box sx={{ ml: { xs: 0.4, sm: 1 }, mb: 'auto', fontSize: '0.6em' }}>
                      <CheckIcon sx={{ transform: 'scale(0.7)' }} />
                    </Box>
                    <Box
                      sx={{
                        my: 'auto',
                        ml: 0.4,
                      }}
                    >
                      {item}
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        <Box sx={{ px: { xs: 1, sm: 4 } }}>
          <Box sx={{ fontSize: '1.4em', fontWeight: 'bold' }}>対象・要件</Box>

          <ul className='learningRequirements'>
            {learningRequirements?.map((item) => {
              return <li>{item.text}</li>;
            })}
          </ul>
        </Box>

        <Box sx={{ px: { xs: 1, sm: 4 }, mt: { xs: 1, sm: 2 } }}>
          <Box sx={{ fontSize: '1.4em', fontWeight: 'bold' }}>解説</Box>

          <Box sx={{ pl: 1, py: { xs: 0.2, sm: 1 } }}>
            <ReadMoreText height='220'>{data.explanation}</ReadMoreText>
          </Box>
        </Box>

        <Box sx={{ px: { xs: 1, sm: 4 }, mt: { xs: 0, sm: 1 } }}>
          <Box sx={{ fontSize: '1.4em', fontWeight: 'bold' }}>目次</Box>
          <Box sx={{ pl: 1, py: { xs: 0.2, sm: 1 } }}>
            <ChapterList />
          </Box>
        </Box>

        <Box sx={{ px: { xs: 1, sm: 4 }, mt: { xs: 1, sm: 2 } }}>
          <Box sx={{ fontSize: '1.4em', fontWeight: 'bold' }}>著者</Box>
          <Box sx={{ px: 1 }}>
            <Author />
          </Box>
        </Box>

        <Box sx={{ px: { xs: 1, sm: 4 }, mt: { xs: 1, sm: 2 } }}>
          <Box sx={{ fontSize: '1.4em', fontWeight: 'bold' }}>読者からのレビュー</Box>
          <Box sx={{ pl: 1, py: 1 }}>
            <RatingReportPanel text={data} />
          </Box>
          <Reviews />
        </Box>

        <Box sx={{ px: { xs: 1, sm: 4 }, mt: { xs: 1, sm: 2 } }}>
          <Box sx={{ fontSize: '1.4em', fontWeight: 'bold' }}>著者によるその他のテキスト</Box>
          <Box sx={{ pl: 1, py: 0.5 }}>
            {dataAuthorTexts ? (
              <AuthorTexts data={dataAuthorTexts} authorId={data.author_id} textId={textId} />
            ) : (
              <CenterLoadingSpinner />
            )}
          </Box>
        </Box>
      </>
    );
  }
};

const ChapterList = () => {
  const router = useRouter();
  const textId = router.query.text_id;
  const { authAxios } = useContext(AuthContext);

  const { data, error } = useSWR(`texts/${textId}/view`, () => getViewText(textId, authAxios), {
    revalidateOnFocus: false,
  });

  /*
  const { data, error } = useSWR(`/texts/${textId}/chapters/`, () => getChapterList(textId), {
    revalidateOnFocus: false,
  });
  */

  if (error) return <div>failed to load</div>;
  if (!data) return <CenterLoadingSpinner />;

  var tocs = {};
  Object.keys(data.chapters).map((id) => {
    const toc = extractToc(data.chapters[id].content);
    tocs[id] = toc;
  });

  function handleChapterClick(item) {
    router.push({
      pathname: `/dashboard/chapters/${item.id}`,
      query: { article_id: id },
    });
  }

  /*
          {data.chapters.((item) => (
            <Box key={item.id} onClick={() => handleChapterClick(item)}>
              {item.title}-[{item.id}]
            </Box>
          ))}
          */

  return (
    <ReadMoreText height={200} id={textId} fontSize={'0.9em'}>
      {Object.keys(data.chapters).map((id) => {
        return (
          <>
            <Box>{data.chapters[id].title}</Box>
            {tocs[id].map((item) => {
              return <Box sx={{ ml: item.depth }}>{item.text}</Box>;
            })}
          </>
        );
      })}
    </ReadMoreText>
  );
};

Text.getLayout = (page) => <ViewTextAbstractLayout>{page}</ViewTextAbstractLayout>;
export default Text;
