<script lang="ts">
    import { Badge } from "$lib/components/ui/badge/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
</script>

<!-- Event Header -->
<Card.Root
    class="flex justify-end h-60 gap-3 bg-linear-to-b from-gray-400 to-black rounded-4xl"
>
    <Card.Header>
        <Card.Title class="text-white text-5xl font-semibold"
            >SEA General Meeting</Card.Title
        >
        <Card.Description class="text-[#F5EFF7]/80">SEA</Card.Description>
    </Card.Header>

    <Card.Content>
        <Card.Action class="space-x-2 flex items-center">
            <Button
                class="bg-[#F7F2FA] text-zinc-800 hover:bg-[#F7F2FA] hover:cursor-pointer"
                ><svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M6.75 12.375C6.225 12.375 5.78125 12.1938 5.41875 11.8313C5.05625 11.4688 4.875 11.025 4.875 10.5C4.875 9.975 5.05625 9.53125 5.41875 9.16875C5.78125 8.80625 6.225 8.625 6.75 8.625C7.275 8.625 7.71875 8.80625 8.08125 9.16875C8.44375 9.53125 8.625 9.975 8.625 10.5C8.625 11.025 8.44375 11.4688 8.08125 11.8313C7.71875 12.1938 7.275 12.375 6.75 12.375ZM3.75 16.5C3.3375 16.5 2.98438 16.3531 2.69063 16.0594C2.39688 15.7656 2.25 15.4125 2.25 15V4.5C2.25 4.0875 2.39688 3.73438 2.69063 3.44063C2.98438 3.14688 3.3375 3 3.75 3H4.5V1.5H6V3H12V1.5H13.5V3H14.25C14.6625 3 15.0156 3.14688 15.3094 3.44063C15.6031 3.73438 15.75 4.0875 15.75 4.5V15C15.75 15.4125 15.6031 15.7656 15.3094 16.0594C15.0156 16.3531 14.6625 16.5 14.25 16.5H3.75ZM3.75 15H14.25V7.5H3.75V15Z"
                        fill="#000000"
                    />
                </svg>
                Add</Button
            >
            <Badge
                variant="buttonMimic"
                class="bg-[#F7F2FA] text-zinc-800 hover:bg-[#F7F2FA] hover:cursor-pointer"
                ><svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M9 4.5V9L12 10.5M16.5 9C16.5 13.1421 13.1421 16.5 9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5C13.1421 1.5 16.5 4.85786 16.5 9Z"
                        stroke="#000000"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>12:00pm - 1:00pm</Badge
            >
        </Card.Action>
    </Card.Content>
</Card.Root>

<!-- Filters? -->
<div class="flex justify-center gap-1 my-6">
    <Button class="rounded-4xl w-32">Label</Button>
    <Button variant="outline" class="rounded-4xl w-32">Label</Button>
</div>

<!-- Description Cards -->
<Card.Root
    class="flex flex-row justify-between shadow-none rounded-none border-t-0 border-x-0 border-b-2"
>
    <Card.Header class="flex grow items-center gap-4 p-0">
        <div class="w-20 h-20 bg-gray-200 rounded-lg"></div>
        <div class="space-y-2">
            <Card.Title class="font-normal text-2xl"
                >Description_Name</Card.Title
            >
            <Card.Description>
                <p>Location</p>
                <p>Synopsis</p>
            </Card.Description>
        </div>
    </Card.Header>

    <Card.Action class="flex items-center gap-4">
        <div class="flex">
            {#each Array(5) as _}
                <svg
                    width="18"
                    height="17"
                    viewBox="0 0 18 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M3.85425 16.3333L5.20842 10.4792L0.666748 6.54167L6.66675 6.02083L9.00008 0.5L11.3334 6.02083L17.3334 6.54167L12.7917 10.4792L14.1459 16.3333L9.00008 13.2292L3.85425 16.3333Z"
                        fill="#625B71"
                    />
                </svg>
            {/each}
        </div>
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12 21L10.55 19.7C8.86667 18.1833 7.475 16.875 6.375 15.775C5.275 14.675 4.4 13.6917 3.75 12.825C3.1 11.9417 2.64167 11.1333 2.375 10.4C2.125 9.66666 2 8.91666 2 8.14999C2 6.58333 2.525 5.27499 3.575 4.22499C4.625 3.17499 5.93333 2.64999 7.5 2.64999C8.36667 2.64999 9.19167 2.83333 9.975 3.19999C10.7583 3.56666 11.4333 4.08333 12 4.74999C12.5667 4.08333 13.2417 3.56666 14.025 3.19999C14.8083 2.83333 15.6333 2.64999 16.5 2.64999C18.0667 2.64999 19.375 3.17499 20.425 4.22499C21.475 5.27499 22 6.58333 22 8.14999C22 8.91666 21.8667 9.66666 21.6 10.4C21.35 11.1333 20.9 11.9417 20.25 12.825C19.6 13.6917 18.725 14.675 17.625 15.775C16.525 16.875 15.1333 18.1833 13.45 19.7L12 21ZM12 18.3C13.6 16.8667 14.9167 15.6417 15.95 14.625C16.9833 13.5917 17.8 12.7 18.4 11.95C19 11.1833 19.4167 10.5083 19.65 9.92499C19.8833 9.325 20 8.73333 20 8.14999C20 7.14999 19.6667 6.31666 19 5.65C18.3333 4.98333 17.5 4.64999 16.5 4.64999C15.7167 4.64999 14.9917 4.87499 14.325 5.32499C13.6583 5.75833 13.2 6.31666 12.95 6.99999H11.05C10.8 6.31666 10.3417 5.75833 9.675 5.32499C9.00833 4.87499 8.28333 4.64999 7.5 4.64999C6.5 4.64999 5.66667 4.98333 5 5.65C4.33333 6.31666 4 7.14999 4 8.14999C4 8.73333 4.11667 9.325 4.35 9.92499C4.58333 10.5083 5 11.1833 5.6 11.95C6.2 12.7 7.01667 13.5917 8.05 14.625C9.08333 15.6417 10.4 16.8667 12 18.3Z"
                fill="#49454F"
            />
        </svg>
    </Card.Action>
</Card.Root>
