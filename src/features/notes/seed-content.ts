export const noteTemplate = `## The context

[Describe the project and the issue you were investigating.]

## Reproducing the problem

[List the conditions and steps that reproduced the issue.]

## What I found

[Explain the cause using concrete evidence, logs or code.]

## The fix

[Show the change and explain why it works. Include code using a fenced code block.]

## Checking the result

[Describe the checks you ran and the outcome.]

## What I learned

[Share the lesson you would apply to the next project.]
`;
export const noteSeeds=[
  {slug:"first-note",title:"[A bug you tracked down, in one line]",category:"Bug write-up",readMins:4},
  {slug:"building-project-one",title:"[How you built one of your projects]",category:"Build log",readMins:6},
  {slug:"another-fix",title:"[Another fix worth sharing]",category:"Bug write-up",readMins:3},
];
