fn main() {

    fn create_solana_article(context: Context<ArticleOnChain>, title: String, preview: String, content: String, mins_read: i32) -> Result<()> {
        let mut article = context.article;

        article.title = title;
        article.preview = preview;
        article.mins_read = mins_read;
        article.content = content;

        Ok(())
    };
    
}

[#derive(Account)]
[#derive(InitSpace)]
pub struct ArticleOnChain<'info> {

    let signer = Signer<'info>;

    #account(
        mut,
        payer = signer,
        seeds = [b'title', id.to_string().as_ref()],
        bump
    );

    [#max_length(45)]
    pub title: String,

    [#max_length(200)]
    pub preview: String,

    [#max_length(1080)]
    pub content: String,

    pub mins_read: i32
}