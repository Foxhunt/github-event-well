export default function(event) {
    switch (event.type) {
        case "PullRequestEvent":
            return "./static/git-pull-request.png"
        case "PushEvent":
            return "./static/repo-push.png"
        case "CreateEvent":
            return "./static/repo.png"
        case "ForkEvent":
            return "./static/repo-forked.png"
        case "DeleteEvent":
            return "./static/trashcan.png"
        case "PullRequestReviewCommentEvent":
        case "IssueCommentEvent":
            return "./static/comment.png"
        case "WatchEvent":
            return "./static/eye.png"
        case "IssuesEvent":
            return "./static/bug.png"
        case "GollumEvent":
            return "./static/book.png"
        case "ReleaseEvent":
                return "./static/tag.png"
        default:
            return ""
    }
}
