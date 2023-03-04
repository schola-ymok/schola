namespace Consts {
  export const HTTP_OK = 200;
  export const HTTP_BAD_REQUEST = 400;
  export const HTTP_FORBIDDEN = 403;
  export const HTTP_METHOD_NOT_ALLOWED = 405;
  export const HTTP_INTERNAL_SERVER_ERROR = 500;

  export const SELECT_LIMIT = 30;
  export const NOTICE_MENU_LIST_NUM = 5;

  export const IMAGE_STORE_URL =
    'https://storage.googleapis.com/' +
    process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET +
    '/user_upload/';

  export const NOTICE_MESSAGE = {
    approved: 'の審査が承認され販売が開始しました。',
    rejected: 'の審査が差し戻されました。',
    banned: 'の販売が停止されました。',
    purchased: 'が売れました。',
    reviewed: 'に対するレビューが投稿されました',
  };

  export const PAGE_LEAVE_WARNING_MESSGAE = '内容が保存されていません。ページを離れてよいですか？';

  export const COLOR = {
    Primary: '#008080',
    PrimaryDark: '#006060',
    LightPrimary: '#e0eaea',
    LightPrimarySelected: '#dfe1e1',
    Grey: '#aaaaaa',
    IconButtonBackGround: '#fefefe',
    IconDarkGrey: '#333333',
    VIEW: {
      Title: '#111111',
      Author: '#999999',
      AuthorHover: '#555555',
      TocTitle: '#888888',
      TocTitleHover: '#333333',
      Primary: '#000080',
      ChapteUpdateDate: '#888888',
    },
  };

  export const TEXTSTATE = {
    Created: 100,
    Draft: 101,
    DraftRejected: 102,
    DraftBanned: 103,
    UnderReview: 200,
    Selling: 300,
    SellingWithReader: 400,
  };

  export const SX = {
    IconButtonHover: {
      color: Consts.COLOR.IconDarkGrey,
      backgroundColor: 'inherit',
    },
    DashedButton: {
      backgroundColor: Consts.COLOR.LightPrimary,
      color: Consts.COLOR.Primary,
      fontWeight: 'bold',
      border: '2px dashed grey',
      '&:hover': { backgroundColor: Consts.COLOR.LightPrimarySelected },
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
    },
  };

  export const VALIDATE = {
    textTitle: {
      min: 4,
      max: 60,
    },
    textAbstract: {
      min: 10,
      max: 180,
    },
    textExplanation: {
      min: 10,
      max: 3000,
    },
    learningContent: {
      min: 2,
      max: 50,
    },
    learningRequirements: {
      min: 2,
      max: 50,
    },
    displayName: {
      min: 1,
      max: 30,
    },
    majors: {
      min: 0,
      max: 50,
    },
    profile: {
      min: 0,
      max: 3000,
    },
    twitter: {
      min: 0,
      max: 30,
    },
    web: {
      min: 0,
      max: 512,
    },
    facebook: {
      min: 0,
      max: 100,
    },
    chapterTitle: {
      min: 1,
      max: 30,
    },
    reviewTitle: {
      min: 1,
      max: 40,
    },
    reviewComment: {
      min: 1,
      max: 500,
    },
    accountName: {
      min: 2,
      max: 24,
    },
  };

  export const CATEGORY = {
    soc: {
      label: '社会・政治・法律',
      items: [
        { key: 'pol', label: '政治' },
        { key: 'dip', label: '外交・国際' },
        { key: 'mil', label: '軍事' },
        { key: 'law', label: '法律' },
        { key: 'soc', label: '社会学' },
        { key: 'eth', label: '倫理学・道徳' },
        { key: 'wom', label: 'ジェンダー' },
        { key: 'wel', label: '福祉' },
        { key: 'env', label: '環境・エコロジー' },
        { key: 'ngp', label: 'NGO・NPO' },
        { key: 'mul', label: 'マスメディア' },
      ],
    },
    his: {
      label: '歴史・地理',
      items: [
        { key: 'his', label: '歴史学' },
        { key: 'jpn', label: '日本史' },
        { key: 'wld', label: '世界史' },
        { key: 'arc', label: '考古学' },
        { key: 'fol', label: '民族学' },
        { key: 'loc', label: '郷土史' },
        { key: 'geo', label: '地理' },
        { key: 'map', label: '地図' },
      ],
    },
    biz: {
      label: 'ビジネス・経済',
      items: [
        { key: 'eco', label: '経済学' },
        { key: 'mkt', label: 'マーケティング・セールス' },
        { key: 'act', label: '経理・アカウンティング' },
        { key: 'fin', label: '金融・ファイナンス' },
        { key: 'mgt', label: 'マネジメント・人材管理' },
        { key: 'str', label: '経営戦略' },
        { key: 'mba', label: '経営学・キャリア・MBA' },
        { key: 'fnd', label: '起業・独立・創業' },
        { key: 'egl', label: 'ビジネス英語' },
        { key: 'coa', label: 'コーチング' },
        { key: 'men', label: 'メンタルヘルス' },
        { key: 'hac', label: '仕事術' },
      ],
    },
    inv: {
      label: '投資・金融・会社経営',
      items: [
        { key: 'stk', label: '株式投資・投資信託' },
        { key: 'rst', label: '不動産投資' },
        { key: 'rec', label: '債券・為替・外貨預金' },
        { key: 'bnk', label: '銀行・金融業' },
        { key: 'sec', label: '証券・金融市場' },
        { key: 'pen', label: '年金・保険' },
        { key: 'tax', label: '税金' },
        { key: 'man', label: '会社経営' },
      ],
    },
    sci: {
      label: '科学・テクノロジー',
      items: [
        { key: 'mth', label: '数学' },
        { key: 'phy', label: '物理学' },
        { key: 'chm', label: '科学' },
        { key: 'ast', label: '宇宙学・天文学' },
        { key: 'eth', label: '地球科学・エコロジー' },
        { key: 'min', label: '金属・鉱学' },
        { key: 'bio', label: '生物・バイオロテクノロジー' },
        { key: 'eng', label: '工学' },
        { key: 'ene', label: 'エネルギー' },
        { key: 'pow', label: '電気・通信' },
        { key: 'agr', label: '農学' },
        { key: 'oce', label: '海洋学' },
      ],
    },
    med: {
      label: '医学・薬学・看護学',
      items: [
        { key: 'med', label: '医学一般' },
        { key: 'int', label: '臨床内科' },
        { key: 'sur', label: '臨床外科' },
        { key: 'uro', label: '泌尿器科学' },
        { key: 'obs', label: '産科・婦人科学' },
        { key: 'ped', label: '小児科学' },
        { key: 'ger', label: '老年医学' },
        { key: 'der', label: '皮膚科学' },
        { key: 'oph', label: '眼科学' },
        { key: 'oto', label: '耳鼻咽喉科学' },
        { key: 'eme', label: '救急医学・集中治療' },
        { key: 'ane', label: '麻酔科学・ペインクリニック' },
        { key: 'rad', label: '放射線医学・核医学' },
        { key: 'can', label: 'がん・腫瘍' },
        { key: 'ort', label: '整形外科学' },
        { key: 'reh', label: 'リハビリテーション医学' },
        { key: 'psy', label: '精神医学・心理学' },
        { key: 'tec', label: '医療関連技術' },
        { key: 'ori', label: '東洋医学' },
        { key: 'pha', label: '薬学' },
        { key: 'nur', label: '看護学' },
        { key: 'den', label: '歯科学' },
        { key: 'exa', label: '試験対策' },
      ],
    },
    cmp: {
      label: 'コンピュータ・IT',
      items: [
        { key: 'prg', label: 'プログラミング' },
        { key: 'web', label: 'WEB・HTML・CSS' },
        { key: 'net', label: 'ネットワーク' },
        { key: 'dat', label: 'データベース' },
        { key: 'per', label: 'パソコン・周辺機器' },
        { key: 'mob', label: 'モバイル・タブレット' },
        { key: 'ifs', label: 'コンピュータサイエンス' },
        { key: 'ebu', label: 'インターネット・eビジネス' },
        { key: 'dtp', label: 'グラフィックス・DTP・音楽' },
        { key: 'art', label: 'コンピュータアート' },
        { key: 'exa', label: '各試験対策' },
      ],
    },
    art: {
      label: 'アート・建築・デザイン',
      items: [
        { key: 'pho', label: '写真' },
        { key: 'pai', label: '絵画' },
        { key: 'cmp', label: 'コンピュータグラフィクス' },
        { key: 'scu', label: '彫刻・工芸' },
        { key: 'arc', label: '建築' },
        { key: 'art', label: '芸術一般' },
        { key: 'hou', label: '住宅建築・家づくり' },
        { key: 'des', label: 'デザイン' },
        { key: 'int', label: 'インテリアデザイン' },
        { key: 'pro', label: 'プロダクトデザイン' },
        { key: 'old', label: '古美術・骨董' },
        { key: 'mus', label: '美術館・博物館' },
      ],
    },
    hob: {
      label: '趣味・実用',
      items: [
        { key: 'slf', label: '自己啓発' },
        { key: 'man', label: '常識・マナー' },
        { key: 'not', label: '手帳・ノート術' },
        { key: 'cra', label: '手芸・クラフト' },
        { key: 'pia', label: 'ピアノ・エレクトーン' },
        { key: 'pai', label: '絵画' },
        { key: 'syo', label: '書道・茶道・華道' },
        { key: 'veh', label: '車・バイク' },
        { key: 'rai', label: '鉄道' },
        { key: 'aud', label: 'オーディオ・ビジュアル' },
        { key: 'col', label: '収集・コレクション' },
        { key: 'mod', label: '模型・プラモデル' },
        { key: 'dro', label: 'ラジコン・ドローン' },
        { key: 'rad', label: 'アマチュア無線' },
        { key: 'ftn', label: '占い' },
        { key: 'qiz', label: '雑学・クイズ' },
        { key: 'puz', label: 'パズル・ゲーム' },
        { key: 'mag', label: '手品' },
        { key: 'igo', label: '囲碁・将棋' },
        { key: 'gbl', label: 'ギャンブル' },
        { key: 'gam', label: 'ゲーム攻略' },
      ],
    },
    spt: {
      label: 'スポーツ・アウトドア',
      items: [
        { key: 'spt', label: 'スポーツ一般' },
        { key: 'cam', label: 'キャンプ' },
        { key: 'cli', label: '登山・ハイキング' },
        { key: 'bol', label: 'クライミング・ボルダリング' },
        { key: 'cyc', label: '自転車・サイクリング' },
        { key: 'fis', label: '釣り' },
        { key: 'run', label: 'ランニング' },
        { key: 'gol', label: 'ゴルフ' },
      ],
    },
    cer: {
      label: '資格・検定',
      items: [
        { key: 'civ', label: '公務員試験' },
        { key: 'tea', label: '教員採用試験' },
        { key: 'law', label: '法律関係' },
        { key: 'egl', label: '英語関係' },
        { key: 'buz', label: 'ビジネス関連' },
        { key: 'cmp', label: 'コンピュータ・情報処理' },
        { key: 'med', label: '医療・看護' },
        { key: 'arc', label: '建築・土木' },
        { key: 'wel', label: '食品・衛生・福祉' },
        { key: 'eng', label: '工学・技術・環境' },
        { key: 'tra', label: '運輸・船舶・通信' },
      ],
    },
    lif: {
      label: '暮らし・健康・子育て',
      items: [
        { key: 'cok', label: 'クッキング・レシピ' },
        { key: 'grm', label: 'グルメ' },
        { key: 'liq', label: 'ワイン・お酒' },
        { key: 'int', label: '住まい・インテリア' },
        { key: 'gar', label: 'ガーデニング' },
        { key: 'pet', label: 'ペット' },
        { key: 'dom', label: '家事' },
        { key: 'die', label: '美容・ダイエット' },
        { key: 'mar', label: '恋愛・結婚・離婚' },
        { key: 'kid', label: '妊娠・出産・子育て' },
        { key: 'fas', label: 'ファッション' },
      ],
    },
    edu: {
      label: '教育・学参・受験',
      items: [
        { key: 'inf', label: '幼児向け' },
        { key: 'ele', label: '小学生向け' },
        { key: 'jun', label: '中学生向け' },
        { key: 'hig', label: '高校生向け' },
        { key: 'abr', label: '海外留学' },
        { key: 'egl', label: '英語学習法' },
        { key: 'how', label: '勉強法' },
      ],
    },
  };
}

export default Consts;
