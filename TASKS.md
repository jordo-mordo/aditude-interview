# Interview Tasks

Welcome. This is a Next.js 14 application scaffold for a multi-tenant publisher management platform. Most of it is intentionally unbuilt — your job is to design, implement, and improve it.

**Read the existing code before writing anything.** There are files worth reviewing carefully before you use them.

You are encouraged to use AI tools. How you prompt them, verify their output, and reason about the results is part of what we're evaluating.

Time estimates are approximate — prioritize breadth over perfection.

You have 1.5 hours to build what you need. After that time there will be a 1-hour follow-up interview where we'll review your work, ask questions, and build upon what you've created.

---

## Part 1 — Database Design

Choose your own database and ORM — use whatever you're most comfortable with.

The system needs to support:
- **Organizations** that have multiple publishers
- **Publishers** that belong to an organization; users may be attached to specific publishers and granted publisher-level permissions
- **Users** that are standalone and can be added to one or more organizations with a role; users also have system-level roles (regular user or system admin) and publisher-specific permissions

Requirements:
- [ ] Design and implement your schema with the appropriate fields, constraints, and relationships
- [ ] Think carefully about: uniqueness constraints, referential integrity, how user↔organization membership is modelled, and how roles/permissions will be represented
- [ ] Seed the database with realistic mock data so the UI has something to display
 - [ ] Add the database schema files to this repository so reviewers can run or inspect your schema

---

## Part 2 — API Routes 

Implement the API routes

---

## Part 3 — Dashboard Page 

`src/app/page.tsx` is intentionally blank.

- [ ] Build a dashboard that allows switching between organizations.
- [ ] Clicking an organization opens an organization detail page (e.g. `/organizations/[id]`) which must render:
	- the publishers belonging to the organization
	- the users relevant to the organization, and for each user show:
		- the publishers the user has access to
		- any publisher-specific permissions the user holds
	- the organization name and basic metadata
- [ ] Provide a UI on the organization page to create a new publisher.
- [ ] Provide a UI on the organization page to add a user: allow creating a user, assigning a system-level role (regular user or), and granting the user access to one or more publishers with specific publisher-level permissions.
- [ ] Add loading states for the dashboard and organization pages while data is fetching, and display clear error messages when requests fail.
- [ ] Make the UI responsive and accessible; prefer simple, testable components so reviewers can verify behavior quickly.

---

## Discussion

Be ready to walk through:
1. The schema decisions you made and why
2. Any issues you found in the existing code
3. What you would change with more time
4. How you would add authentication to this app
