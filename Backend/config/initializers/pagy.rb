require "pagy/extras/limit"

Pagy::DEFAULT[:limit] = 9
Pagy::DEFAULT[:limit_extra] = true  # allow client to set limit via params
