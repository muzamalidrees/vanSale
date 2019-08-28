import { AbilityBuilder } from "@casl/ability";

let roles;
let permissions;
let rolePermissions;
fetch('/getAllRoles')
    .then((res) => res.json())
    .then((json) => {
        // console.log(json)
        roles = json.data
    })
    .catch((err => {
        console.log(err);
    }))
fetch('/getAllPermissions')
    .then((res) => res.json())
    .then((json) => {
        // console.log(json)
        permissions = json.data
    })
    .catch((err => {
        console.log(err);
    }))

fetch('/getAllRolesPermissions')
    .then((res) => res.json())
    .then((json) => {
        // console.log(json)
        rolePermissions = json.data
    })
    .catch((err => {
        console.log(err);
    }))

export default function defineRulesFor(role) {
    const { can, rules } = AbilityBuilder.extract();

    //finding user's role
    let userRoleId;
    if (roles !== undefined) {
        roles.forEach(Role => {
            if (Role.name === role) {
                userRoleId = Role.id
            }
        })

        //getting permissions against that role
        let userRolePermissions = rolePermissions !== undefined && userRoleId !== undefined ?
            rolePermissions.filter(rolePermission => rolePermission.role_id === userRoleId) : undefined

        //getting user's permissions
        let userPermissions = []
        if (userRolePermissions !== undefined && permissions !== undefined) {
            userRolePermissions.forEach(rolePermission => {
                permissions.forEach(permission => {
                    if (permission.id === rolePermission.permission_id) {
                        userPermissions.push(permission)
                    }
                })
            })
        }
        // console.log(userPermissions);

        // defining rules for user
        if (userPermissions !== [] && userPermissions !== undefined) {
            for (let index = 0; index < userPermissions.length; index++) {
                can(`${userPermissions[index].permission}`, `${userPermissions[index].entity}`)
            }
        }
        // can("manage", "all");
        // can("read", "all");
        // can("delete", "all");
        // can("update", "all");
        // can("create", "all");

        // switch (role) {
        //     // case "superAdmin":
        //     //     can("manage", "all");
        //     //     break;
        //     case "admin":

        //         can("manage", "all");
        //         // can("read", "all");
        //         // can("delete", "all");
        //         // can("update", "all");
        //         // can("create", "all");
        //         break;
        //     case "operator":
        //         can("read", "user");
        //         can('create', 'order')
        //         can("read", "order");
        //         can("update", "order");
        //         can("delete", "order");
        //         break;
        //     case "endUser":
        //         can("read", "order");
        //         break;
        //     default:
        //         can("read", "order");
        // }
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