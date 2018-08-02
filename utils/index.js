
const generateReferenceObject = (data, docs) => {
   
    const key = data[0].username ?
        'username' :
        'title'

    return data.reduce((acc, datum, i) => {
        acc[datum[key].toLowerCase()] = docs[i]._id
        return acc
    }, {})
}

const formatArticleData = (articleData, userRefs, topicRefs) => {
    return articleData.map(articleDatum => {
        return {
            ...articleDatum,
            created_by: userRefs[articleDatum.created_by],
            belongs_to: articleDatum.topic
        }
    })
}

const formatCommentData = (commentData, articleRefs, userRefs) => {
    return commentData.map(commentDatum => {
        return {
            ...commentDatum,
            created_by: userRefs[commentDatum.created_by.toLowerCase()],
            belongs_to: articleRefs[commentDatum.belongs_to.toLowerCase()]
        }
    })
}


module.exports = { formatArticleData, formatCommentData , generateReferenceObject}