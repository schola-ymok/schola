# texts/index

## post テキストの新規作成

- param

  - user_verify
  - body

        {
          title: string
        }

- response

      {
        status: ok|error
        text_id{ok}: string,
        error{erro}: string
      }

# texts/[text_id]/index

## get テキストの参照

- param

  - brf=1

- response

      <Text>|<BriefText>

## put テキストの更新(author 権限)

- param

  - rls=1
  - user_verify
  - body
    rls=1 {is_released:boolean}

        {
          title: string,
          abstract: string,
          category1: string,
          category2: string,
          price: integer,
          learning_contents: [string],
          learning_requirements: [string],
          is_released: boolean
        }

- response

      {
        status: ok|error
        error{erro}: string
      }

## delete テキストの削除(author 権限)

- param

  - user_verify

- response

      {
        status: ok|error
        error{erro}: string
      }

# texts/[text_id]/chapters

## get チャプターリストの取得

- response

      [
        <BriefChapter>
      ]

## put チャプターの並び順更新(author 権限)

- param

  - user_verify
  - body

        {
            chapter_order: [string]
        }

- response

      {
        status: ok|error
        error{erro}: string
      }

## post チャプターの作成(author 権限)

- param

  - user_verify

- response

      {
        status: ok|error
        chapter_id{ok}: string,
        error{erro}: string
      }

# texts/[text_id]/chapters/[chapter_id]

## get チャプターの取得 (author 権限、購入権限、トライアル)

- response

      <Chapter>

## put チャプターの更新（author 権限）

- param

  - user_verify
  - body
    {
    title{opt}: string,
    content{opt}: string,
    trial_reading_available{opt}: true|false
    }

- response

      {
        status: ok|error
        error{erro}: string
      }

## delete チャプターの削除（author 権限）

- param

  - user_verify

- response

      {
        status: ok|error
        error{erro}: string
      }

# texts/[text_id]/reviews/index

## get 自分のレビューの取得

- param
  {
  mine
  }

- response

      {
        exists:true|false
        review: {
          <Review>
        }
      }

## get レビューリストの取得

- param

      {
        page:integer
        rate:integer
      }

- response

      {
        total: integer,
        page: integer,
        rate: integer,
        reviews: [
          <Review>
        ]
      }

## post レビューの upsert

- param

  - user_verify
  - body
    {
    title: string,
    comment: string,
    rate: integer
    }

- response

      {
        status: ok|error,
        review_id: string,
        error{erro}: string
      }

## delete レビューの削除（レビュー author 権限）

- param

  - user_verify

- response

      {
        status: ok|error,
        error{erro}: string
      }

# texts/[text_id]/reviews/[review_id]

## get レビューの取得

- response

      <Review>

# texts/[text_id]/collaborative

## get 似たテキストリストを取得

- response

      [
        <BriefText>
      ]

# dashboard/texts

## get 執筆したテキストリストを取得

- param
  {
  page:integer
  }

- response

      {
        total: integer,
        texts:
        [
          <BriefText>
        ]
      }

# dashboard/reviews

## get 全自筆テキストのレビューリストを取得

- param
  {
  page:integer
  }

- response

  {
  total: integer,
  reviews:
  [
  <Review>
  ]
  }

# dashboard/performance

## get パフォーマンスを取得

- response

       {
         number_of_total_views: integer,
         number_of_total_reviews: integer,
         number_of_total_sales: integer,
         texts: [
           {
             id: string,
             title: string,
             number_of_views: integer,
             number_of_reviews: integer,
             number_of_purchases: integer
           }
         ]
       }

# account/index

## get アカウント情報を取得

- param

  - user_verify
  - ?prl=1

- response

  <BriefUser>{prl=true}
  <User>{prl=false}

## put アカウント情報を更新

### 通知設定の更新

- param

  - user_verify
  - ?notifypurchase=1|0/notifyreview=1|0

- response

       {
         status: ok|error
         error{erro}: string
       }

### プロファイル画像アップロード更新

- param

  - user_verify
  - ?photouploaded

- response

       {
         status: ok|error
         error{erro}: string
       }

### プロフィールの更新

- param

  - user_verify
  - body

        {
          display_name{opt}: string,
          profile{opt}: string,
          majors{opt}: string,
          twitter{opt}: string,
          web{opt}: string,
          facebook{opt}: string
        }

- response

       {
         status: ok|error
         error{erro}: string
       }

## post アカウントを作成

- param

  - user_verify
  - body

        {
          account_name: string,
          display_name: string
        }

- response

       {
         status: ok|exists|duplicate|error,
         user_id{ok}: string,
         error{erro}: string
       }

# account/texts

## get 購入済みのテキストリストを取得

- response

      [
        purchased_at: date,
        text: <BriefText>
      ]

# users/[user_id]

## get ユーザ情報を取得

- response

     <User>

# users/[user_id]/texts

## get ユーザの公開しているテキストリストを取得

- response

      [
        <BriefText>
      ]

# purchase/[text_id]

## get テキストの購入情報を取得

- param

  - user_verify

- response
  {
  purchased: true | false
  purchased_at{purchesed}: date
  }

## post テキストを購入

- param

  - user_verify

- response

      {
        status: ok|error
        error{erro}: string
      }

# texts/index

## get テキストリストを取得

- param

  - user_verify{opt}
  - body

        {
          home
          type: new|ranking|viewed|collaborative,
          category1{opt}: string,
          category2{opt}: string,
          keyword{opt}: string,
          sort:{opt}: sales|new|old|review|price_high|price_low
          rate_lower_limit{opt}: integer
        }

- response

      [
        <BriefText>
      ]
