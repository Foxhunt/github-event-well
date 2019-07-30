import { getIconByName } from "@primer/octicons-react"

export default function(event) {
    switch (event.type) {
        case "PullRequestEvent":
            return getIconByName("git-pull-request")
        case "PushEvent":
            return getIconByName("repo-push")
        case "CreateEvent":
            return getIconByName("repo")
        case "ForkEvent":
            return getIconByName("repo-forked")
        case "DeleteEvent":
            return getIconByName("trashcan")
        case "PullRequestReviewCommentEvent":
        case "IssueCommentEvent":
            return getIconByName("comment")
        case "WatchEvent":
            return getIconByName("eye")
        case "IssuesEvent":
            return getIconByName("bug")
        case "GollumEvent":
            return getIconByName("book")
        case "ReleaseEvent":
                return getIconByName("tag")
        default:
            return getIconByName("tag")
    }
}
