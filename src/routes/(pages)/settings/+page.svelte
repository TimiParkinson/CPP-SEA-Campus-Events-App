<script lang=ts>

  //combo box imports
  import CheckIcon from "@lucide/svelte/icons/check";
  import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
  import { tick } from "svelte";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";

  import { Badge } from "$lib/components/ui/badge/index.js";

  // Define the interface for a pronoun
  interface Pronoun {
    value: string;
    label: string;
  }

  const allPronounOptions: Pronoun[] = [
    { value: "she", label: "She" },
    { value: "her", label: "Her" },
    { value: "hers", label: "Hers" },
    { value: "he", label: "He" },
    { value: "him", label: "Him" },
    { value: "his", label: "His" },
    { value: "they", label: "They" },
    { value: "them", label: "Them" },
    { value: "theirs", label: "Theirs" },
    { value: "it", label: "It" },
    { value: "its", label: "Its" },
    { value: "ze", label: "Ze" },
    { value: "zir", label: "Zir" },
    { value: "zirs", label: "Zirs" },
    { value: "hir", label: "Hir" },
    { value: "hirs", label: "Hirs" },
    { value: "xe", label: "Xe" },
    { value: "xem", label: "Xem" },
    { value: "xyr", label: "Xyr" },
    { value: "xir", label: "Xir" },
    { value: "fae", label: "Fae" },
    { value: "faer", label: "Faer" },
    { value: "ey", label: "Ey" },
    { value: "em", label: "Em" },
    { value: "eir", label: "Eir" },
    { value: "e", label: "E" },
    { value: "ae", label: "Ae" },
    { value: "aer", label: "Aer" },
    { value: "aers", label: "Aers" },
    { value: "ve", label: "Ve" },
    { value: "ver", label: "Ver" },
    { value: "vis", label: "Vis" },
    { value: "ne", label: "Ne" },
    { value: "nem", label: "Nem" },
    { value: "nir", label: "Nir" },
    { value: "ask", label: "Ask my pronouns" }
  ];

  let open = $state(false);
  let value = $state("");
  let triggerRef = $state<HTMLButtonElement>(null!);
 
  let selectedPronouns = $state<Pronoun[]>([]);

  // select a pronoun
  function selectPronoun(option: Pronoun) {
    if (!selectedPronouns.includes(option)) {
      selectedPronouns = [...selectedPronouns, option];
    }
  }

  // remove pronoun
  function removePronoun(option: Pronoun) {
    selectedPronouns = selectedPronouns.filter((o) => o !== option);
  }

  const selectedValue = $derived(
    allPronounOptions.find((f) => f.value === value)?.label
  );
 
  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => {
      triggerRef.focus();
    });
  }

</script>

<svelte:head>
	<title>Settings - Campus Events</title>
</svelte:head>


<div class="space-y-16 pt-24">
  <h1 class="text-4xl leading-tight font-bold">Settings</h1>

  <div class="space-y-2">
    <!-- Selected items box -->
    <div class="flex gap-2 p-2 border rounded bg-gray-100">
      {#each selectedPronouns as item (item.value)}
        <Badge class="flex items-center gap-1 px-3 py-1">
          {item.label}
          <button
            type="button"
            class="ml-1 text-xs opacity-60 hover:opacity-100 transition"
            onclick={(e) => {
              e.stopPropagation();
              removePronoun(item);
            }}
          >
            ✕
          </button>
        </Badge>
      {/each}

    </div>

    <!-- Options list -->
    <!--<div class="flex gap-2">
      {#each allPronounOptions as option}
        <Button
          variant={selectedPronouns.includes(option) ? "secondary" : "outline"}
          onClick={() => selectPronoun(option)}
        >
          {option.label}
        </Button>
      {/each}
    </div> -->
  </div>


    
    <Popover.Root bind:open>
    <Popover.Trigger bind:ref={triggerRef}>
        {#snippet child({ props })}
        <Button
            {...props}
            variant="outline"
            class="w-[200px] justify-between"
            role="combobox"
            aria-expanded={open}
        >
            {selectedPronouns.length > 0
              ? selectedPronouns.map(p => p.label).join(", ")
              : "Select your pronouns..."}
            <ChevronsUpDownIcon class="opacity-50" />
        </Button>
        {/snippet}
    </Popover.Trigger>
    <Popover.Content class="w-[200px] p-0">
        <Command.Root>
        <Command.Input placeholder="Search pronouns..." />
        <Command.List>
            <Command.Empty>Pronoun not found.</Command.Empty>
            <Command.Group value="pronouns">
            {#each allPronounOptions as pronoun (pronoun.value)}
                <Command.Item
                value={pronoun.value}
                onSelect={() => {
                    const exists = selectedPronouns.find(p => p.value === pronoun.value);
                  if (exists) {
                    selectedPronouns = selectedPronouns.filter(
                      p => p.value !== pronoun.value
                    );
                  } else {
                    selectedPronouns = [...selectedPronouns, pronoun];
                  }
                }}
                >
                <CheckIcon
                    class={cn(
                      !selectedPronouns.some(p => p.value === pronoun.value) &&
                      "text-transparent"
                    )}
                />
                {pronoun.label}
                </Command.Item>
            {/each}
            </Command.Group>
        </Command.List>
        </Command.Root>
    </Popover.Content>
    </Popover.Root>


</div>