package kma

class UrlMappings {

    static mappings = {
        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }

		"/"(controller: "kma", action: "new0003")
        "500"(view:'/error')
        "404"(view:'/notFound')
    }
}
