import { AbilityBuilder } from "@casl/ability";
export default function defineRulesFor(role) {
    const { can, rules } = AbilityBuilder.extract();
    switch (role) {
        // case "superAdmin":
        //     can("manage", "all");
        //     break;
        case "admin":
            can("manage", "all");
            // can("read", "all");
            // can("delete", "all");
            // can("update", "all");
            // can("create", "all");
            break;
        case "operator":
            can("read", "user");
            can('create', 'order')
            can("read", "order");
            can("update", "order");
            can("delete", "order");
            break;
        case "endUser":
            can("read", "order");
            break;
        default:
            can("read", "order");
    }
    return rules;
}

// import { AbilityBuilder } from '@casl/ability'

// const superAdmin = AbilityBuilder.define(can => {
//     can('manage', 'all')
// });

// const admin = AbilityBuilder.define((can, cannot) => {
//     can('read', 'all')
//     can('delete', 'all')
//     cannot('update', 'user')
//     cannot('create', 'customer')
// });
// const operator = AbilityBuilder.define(can => {
//     can('read', 'all')
//     can('create', 'all')

// });

// const endUser = AbilityBuilder.define(can => {
//     can('read', 'all')
// });
// const ABILITIES = { superAdmin, admin, operator, endUser }
// export default ABILITIES