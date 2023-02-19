import fs from 'fs';
import path from 'path';

import escape from 'sql-template-strings';

import dbQuery from 'libs/db';
import Consts from 'utils/Consts';
import { genid } from 'utils/genid';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const USER_NUM = 50;
  const REP_AUTHOR_ID = 'hB0VDtl4';
  const TEXT_NUM_LIMIT = 100000;

  function randomAchievement(cat1, cat2) {
    var a = [
      'の学習方法',
      'の基本',
      'の基本から応用まで',
      'の応用',
      '全般',
      'に関する全般',
      '上級',
      '初級',
      '中級',
      'について',
      'に関すること',
      'の習得',
      'の学習',
    ];

    var arr = [];
    for (var i = 0; i < Math.random() * 8; i++) {
      if (Math.random() > 0.5) {
        const item = Consts.CATEGORY[cat1].label + a[Math.floor(Math.random() * a.length)];
        arr.push(item);
      } else {
        var label = '';
        for (var h = 0; h < Consts.CATEGORY[cat1].items.length; h++) {
          if (Consts.CATEGORY[cat1].items[h].key == cat2) {
            const dd = Consts.CATEGORY[cat1].items[h];
            label = dd.label;
            break;
          }
        }

        const item = label + a[Math.floor(Math.random() * a.length)];
        arr.push(item);
      }
    }

    return JSON.stringify(arr);
  }

  function randomRequirement() {
    var a = [
      '大学初年度',
      '大学生',
      '高校生',
      '中学生',
      '入門者',
      '線形代数に関する基礎知識',
      '高校卒業レベル',
      '子供でも理解可能',
      '初心者',
      '中級者',
      '上級者',
      '高校数学レベルの数学知識',
      '中学数学レベルの数学知識',
      'プログラミングの基礎知識',
      '理系大学卒レベルの数学知識',
      '微分積分に関する知識',
      '誰でも',
      'WindowsPC',
      'MacOS',
      '企業に勤める技術者',
      'マーケティング担当者',
      '営業担当者',
      '法律の基本的知識',
      'マーケティングの基本的知識',
      '社会人～３年目',
      '社会人～４年目',
      '法務担当者',
      '興味があれば誰でも',
    ];

    var arr = [];
    for (var i = 0; i < Math.random() * 8; i++) {
      const item = a[Math.floor(Math.random() * a.length)];
      arr.push(item);
    }

    return JSON.stringify(arr);
  }

  function randomReview(isTitle) {
    var reviews = [
      '素晴らしい',
      '秀逸なテキストです',
      '印刷して隅から隅まで読みました',
      '教科書ではわからなかったことがこれで理解できました',
      '買って損はありません',
      'この内容でこの値段はかなりお得です',
      '涙を流して読みました',
      '学生さんは必読',
      'もっと早く読んでおけばよかった',
      '感動しました！！！',
      'シリーズを書籍化してほしいです',
      '分かり易かったです',
      'シンプル is ベスト',
      'タイム is マネー',
      '私の人生を変えました',
      '私の進路を決定するきっかけになりました',
      '自分の知識と照らし合わせながら読むことができた',
      'キーワードが多くてメモしやすい',
      '説得力がある',
      '章あたりの分量が多くなく、読みやすい。',
      '網羅的でわかりやすかった',
      '具体的',
      'たくさんの人に読んで欲しいです。',
      '難しいことがシンプルに説明されています',
      '内容が非常に具体的でよかった',
      '納得です',
      '非常に良かった',
      '最後の一文が心に刺さりました。',
      '腑に落ちた',
      'データ分析のアプローチが習得できました',
      '内容が分かりやすくよかったです。',
      'ありがとうございました',
      '丁寧でわかりやすい',
      'オススメしたいテキストです',
      '殿堂入り',
      '学べたいときに学べる',
    ];

    if (isTitle) {
      return reviews[Math.floor(Math.random() * reviews.length)];
    } else {
      var ret = '';
      for (var i = 0; i < Math.floor(Math.random() * 50); i++) {
        ret += reviews[Math.floor(Math.random() * reviews.length)] + ' ';
      }
      return ret;
    }
  }

  function randomName() {
    var myoujiAry = [
      '佐藤',
      '鈴木',
      '高橋',
      '田中',
      '渡辺',
      '伊藤',
      '山本',
      '中村',
      '小林',
      '加藤',
      '吉田',
      '山田',
      '佐々木',
      '山口',
      '斎藤',
      '松本',
      '井上',
      '木村',
      '林',
      '清水',
      '山崎',
      '森',
      '阿部',
      '池田',
      '橋本',
      '山下',
      '石川',
      '中島',
      '前田',
      '藤田',
      '小川',
      '後藤',
      '岡田',
      '長谷川',
      '村上',
      '近藤',
      '石井',
      '齊藤',
      '坂本',
      '遠藤',
      '青木',
      '藤井',
      '西村',
      '福田',
      '太田',
      '三浦',
      '岡本',
      '松田',
      '中川',
      '中野',
      '原田',
      '小野',
      '田村',
      '竹内',
      '金子',
      '和田',
      '中山',
      '藤原',
      '石田',
      '上田',
      '森田',
      '原',
      '柴田',
      '酒井',
      '工藤',
      '横山',
      '宮崎',
      '宮本',
      '内田',
      '高木',
      '安藤',
      '谷口',
      '大野',
      '丸山',
      '今井',
      '高田',
      '藤本',
      '武田',
      '村田',
      '上野',
      '杉山',
      '増田',
      '平野',
      '大塚',
      '千葉',
      '久保',
      '松井',
      '小島',
      '岩崎',
      '桜井',
      '野口',
      '松尾',
      '野村',
      '木下',
      '菊地',
      '佐野',
      '大西',
      '杉本',
      '新井',
      '浜田',
      '菅原',
      '市川',
      '水野',
      '小松',
      '島田',
      '古川',
      '小山',
      '高野',
      '西田',
      '菊池',
      '山内',
      '西川',
      '五十嵐',
      '北村',
      '安田',
      '中田',
      '川口',
      '平田',
      '川崎',
      '飯田',
      '吉川',
      '本田',
      '久保田',
      '沢田',
      '辻',
      '関',
      '吉村',
      '渡部',
      '岩田',
      '中西',
      '服部',
      '樋口',
      '福島',
      '川上',
      '永井',
      '松岡',
      '田口',
      '山中',
      '森本',
      '土屋',
      '矢野',
      '広瀬',
      '秋山',
      '石原',
      '松下',
      '大橋',
      '松浦',
      '吉岡',
      '小池',
      '馬場',
      '浅野',
      '荒木',
      '大久保',
      '野田',
      '小沢',
      '田辺',
      '川村',
      '星野',
      '黒田',
      '堀',
      '尾崎',
      '望月',
      '永田',
      '熊谷',
      '内藤',
      '松村',
      '西山',
      '大谷',
      '平井',
      '大島',
      '岩本',
      '片山',
      '本間',
      '早川',
      '横田',
      '岡崎',
      '荒井',
      '大石',
      '鎌田',
      '成田',
      '宮田',
      '小田',
      '石橋',
      '篠原',
      '須藤',
      '河野',
      '大沢',
      '小西',
      '南',
      '高山',
      '栗原',
      '伊東',
      '松原',
      '三宅',
      '福井',
      '大森',
      '奥村',
      '岡',
      '内山',
      '片岡',
    ];
    var namaeAry = [
      '大輔',
      '誠',
      '直樹',
      '亮',
      '剛',
      '大介',
      '学',
      '健一',
      '健',
      '哲也',
      '聡',
      '健太郎',
      '洋平',
      '淳',
      '竜也',
      '崇',
      '翔太',
      '拓也',
      '健太',
      '翔',
      '達也',
      '雄太',
      '翔平',
      '大樹',
      '大輔',
      '和也',
      '達也',
      '翔太',
      '徹',
      '哲也',
      '秀樹',
      '英樹',
      '浩二',
      '健一',
      '博',
      '博之',
      '修',
      '大輝',
      '拓海',
      '海斗',
      '大輔',
      '大樹',
      '翔太',
      '大輝',
      '翼',
      '拓海',
      '直人',
      '康平',
      '達也',
      '駿',
      '雄大',
      '亮太',
      '拓也',
      '大貴',
      '亮太',
      '拓哉',
      '雄大',
      '誠',
      '隆',
      '茂',
      '豊',
      '明',
      '浩',
      '進',
      '勝',
      '洋子',
      '恵子',
      '京子',
      '幸子',
      '和子',
      '久美子',
      '由美子',
      '裕子',
      '美智子',
      '悦子',
      '智子',
      '久美子',
      '陽子',
      '理恵',
      '真由美',
      '香織',
      '恵',
      '愛',
      '優子',
      '智子',
      '裕美',
      '真由美',
      'めぐみ',
      '美穂',
      '純子',
      '美紀',
      '彩',
      '美穂',
      '成美',
      '沙織',
      '麻衣',
      '舞',
      '愛美',
      '瞳',
      '彩香',
      '麻美',
      '沙織',
      '麻衣',
      '由佳',
      'あゆみ',
      '友美',
      '麻美',
      '裕子',
      '美香',
      '恵美',
      '直美',
      '由美',
      '陽子',
      '直子',
      '未来',
      '萌',
      '美咲',
      '亜美',
      '里奈',
      '菜々子',
      '彩花',
      '遥',
      '美咲',
      '明日香',
      '真由',
      '楓',
      '奈々',
      '彩花',
      '優花',
      '桃子',
      '美咲',
      '佳奈',
      '葵',
      '菜摘',
      '桃子',
      '茜',
      '明美',
      '京子',
      '恵子',
      '洋子',
      '順子',
      '典子',
    ];
    var myouji = myoujiAry[Math.floor(Math.random() * myoujiAry.length)];
    var namae = namaeAry[Math.floor(Math.random() * namaeAry.length)];
    return myouji + ' ' + namae;
  }

  async function updateReviewStastics(textId) {
    const { data: dataCount, error: errorCount } = await dbQuery(escape`
    select rate, count(*) as cnt from reviews where text_id = ${textId} group by rate`);

    if (errorCount) return;

    const sumCount = dataCount.reduce((a, x) => {
      return a + x.cnt;
    }, 0);
    const sumRate = dataCount.reduce((a, x) => {
      return a + x.rate * x.cnt;
    }, 0);

    const avg = (sumRate / sumCount).toFixed(1);

    var r1 = 0,
      r2 = 0,
      r3 = 0,
      r4 = 0,
      r5 = 0;

    dataCount.map((item) => {
      const ratio = Math.floor((item.cnt / sumCount) * 100);
      if (item.rate == 1) r1 = ratio;
      if (item.rate == 2) r2 = ratio;
      if (item.rate == 3) r3 = ratio;
      if (item.rate == 4) r4 = ratio;
      if (item.rate == 5) r5 = ratio;
    });

    await dbQuery(escape`update texts set number_of_reviews = ${sumCount},
    rate_ratio_1 = ${r1},
    rate_ratio_2 = ${r2},
    rate_ratio_3 = ${r3},
    rate_ratio_4 = ${r4},
    rate_ratio_5 = ${r5},
    rate = ${avg} where id = ${textId}
    `);
  }

  async function writeReview(textId) {
    let numOfReviews = 0;
    let numOfSales = 0;
    let avgRate = 0;

    for (var i = 0; i < USER_NUM; i++) {
      if (Math.random() > 0.1) {
        const uid = 'uid-' + ('0000' + i).slice(-4);
        const { error: error3 } = await dbQuery(escape`
            insert into purchases (
                user_id,
                text_id
              )values(
                ${uid},
                ${textId}
            )`);

        numOfSales++;
        if (error3) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

        if (Math.random() > 0.2) {
          const rate = Math.floor(Math.random() * 5) + 1;
          const title = randomReview(true);
          const comment = randomReview(false);
          const rid = genid();
          avgRate += rate;
          numOfReviews++;

          const { error: error2 } = await dbQuery(escape`
            insert into reviews (
                id,
                text_id,
                user_id,
                title,
                comment,
                rate
              )values(
                ${rid},
                ${textId},
                ${uid},
                ${title},
                ${comment},
                ${rate}
            )`);
          if (error2) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');
        }
      }
    }
    if (numOfReviews != 0) {
      avgRate = Math.floor(avgRate / numOfReviews);
    }
    const { error: error4 } = await dbQuery(escape`
          update texts
          set
          number_of_reviews = ${numOfReviews},
          number_of_sales = ${numOfSales},
          rate = ${avgRate}
          where id = ${textId}`);

    updateReviewStastics(textId);
  }

  if (req.query.id) {
    writeReview(req.query.id);
    return res.status(Consts.HTTP_OK).json({
      status: 'ok',
    });
  }

  const jsonPath = path.resolve('./src/pages/api/debug/', 'books.json');
  const booksJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  // delete
  for (var i = 0; i < booksJson.length; i++) {
    if (i > TEXT_NUM_LIMIT) break;
    const texts = booksJson[i].texts;
    for (var j = 0; j < texts.length; j++) {
      const textId = texts[j].id;
      await dbQuery(escape`delete from purchases where text_id=${textId}`);
      await dbQuery(escape`delete from reviews where text_id=${textId}`);
      await dbQuery(escape`delete from texts where id=${textId}`);
    }
  }

  for (var i = 0; i < USER_NUM; i++) {
    userId = 'uid-' + ('0000' + i).slice(-4);
    await dbQuery(escape`delete from users where id = ${userId}`);
  }

  // gen dummy users
  var accountName, displayName, userId, firebaseId;
  for (var i = 0; i < USER_NUM; i++) {
    accountName = 'account-' + i;
    displayName = randomName();
    userId = 'uid-' + ('0000' + i).slice(-4);
    firebaseId = genid() + genid() + genid() + genid() + genid() + genid();

    const { error: errorAdd } = await dbQuery(escape`
      insert into users (
        id,
        firebase_id,
        account_name,
        display_name
      ) values (
        ${userId},
        ${firebaseId},
        ${accountName},
        ${displayName}
      )`);

    if (errorAdd) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');
  }

  // gen dummy texts, review
  for (var k = 0; k < booksJson.length; k++) {
    if (k > TEXT_NUM_LIMIT) break;

    const texts = booksJson[k].texts;
    const cat1 = booksJson[k].cat1;
    const cat2 = booksJson[k].cat2;

    for (var l = 0; l < texts.length; l++) {
      const textId = texts[l].id;
      const textTitle = texts[l].title;
      let description = texts[l].description;

      if (!description) description = '概要なし';

      /*
      const AUTHOR_ID =
        Math.random() > 0.95
          ? REP_AUTHOR_ID
          : 'uid-' + ('0000' + Math.floor(Math.random() * USER_NUM)).slice(-4);
          */
      const AUTHOR_ID = 'uid-' + ('0000' + Math.floor(Math.random() * USER_NUM)).slice(-4);

      const price = Math.floor(Math.random() * 10 + 1) * 100;

      const { error: textAdd } = await dbQuery(escape`
      insert into texts (
        id,
        title,
        author_id,
        abstract,
        explanation,
        learning_contents,
        learning_requirements,
        is_public,
        state,
        number_of_updated,
        number_of_sales,
        number_of_reviews,
        is_best_seller,
        category1,
        category2,
        price
      ) values (
        ${textId},
        ${textTitle},
        ${AUTHOR_ID},
        ${description.substring(0, 128)},
        ${description},
        ${randomAchievement(cat1, cat2)},
        ${randomRequirement()},
        true,
        ${Consts.TEXTSTATE.Selling},
        0,
        0,
        0,
        false,
        ${cat1},
        ${cat2},
        ${price}
      )`);

      if (textAdd) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

      let numOfReviews = 0;
      let numOfSales = 0;
      let avgRate = 0;

      for (var i = 0; i < USER_NUM; i++) {
        if (Math.random() > 0.7) {
          const uid = 'uid-' + ('0000' + i).slice(-4);
          const { error: error3 } = await dbQuery(escape`
            insert into purchases (
                user_id,
                text_id
              )values(
                ${uid},
                ${textId}
            )`);

          numOfSales++;
          if (error3) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');

          if (Math.random() > 0.5) {
            const rate = Math.floor(Math.random() * 5) + 1;
            const title = randomReview(true);
            const comment = randomReview(false);
            const rid = genid();
            avgRate += rate;
            numOfReviews++;

            const { error: error2 } = await dbQuery(escape`
            insert into reviews (
                id,
                text_id,
                user_id,
                title,
                comment,
                rate
              )values(
                ${rid},
                ${textId},
                ${uid},
                ${title},
                ${comment},
                ${rate}
            )`);
            if (error2) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');
          }
        }
      }
      if (numOfReviews != 0) {
        avgRate = Math.floor(avgRate / numOfReviews);
      }
      const { error: error4 } = await dbQuery(escape`
          update texts
          set
          number_of_reviews = ${numOfReviews},
          number_of_sales = ${numOfSales},
          rate = ${avgRate}
          where id = ${textId}`);

      updateReviewStastics(textId);

      if (error4) return res.status(Consts.HTTP_INTERNAL_SERVER_ERROR).end('error');
    }
  }

  return res.status(Consts.HTTP_OK).json({
    status: 'ok',
  });
}
