# Context Relationship Diagram

This diagram shows the relationships between different context elements in the project.

```mermaid
graph TD
    business_domain[Business Domain\n(Business)]
    business_roles[Business Roles\n(Business)]
    business_processes[Business Processes\n(Business)]
    technical_architecture[Technical Architecture\n(Technical)]
    technical_components[Technical Components\n(Technical)]
    technical_data[Data Model\n(Technical)]
    operational_workflows[Operational Workflows\n(Operational)]
    operational_policies[Operational Policies\n(Operational)]
    user_personas[User Personas\n(User)]
    user_journeys[User Journeys\n(User)]

    business_domain -- influences --> business_roles
    business_domain -- contains --> business_processes
    business_roles -- maps to --> user_personas
    business_processes -- implements --> operational_workflows
    technical_architecture -- contains --> technical_components
    technical_components -- uses --> technical_data
    user_journeys -- follows --> operational_workflows
    operational_policies -- governs --> business_processes
```

## Legend
- **Business** - Business domain, roles, and processes
- **Technical** - Technical architecture and components
- **Operational** - Workflows and policies
- **User** - Personas and journeys

## Relationships
- **business_domain → business_roles**: Business domain influences the roles defined in the organization
- **business_domain → business_processes**: Business domain contains various business processes
- **business_roles → user_personas**: Business roles map to user personas
- **business_processes → operational_workflows**: Business processes are implemented as operational workflows
- **technical_architecture → technical_components**: Technical architecture contains various components
- **technical_components → technical_data**: Technical components use the data model
- **user_journeys → operational_workflows**: User journeys follow operational workflows
- **operational_policies → business_processes**: Operational policies govern business processes
