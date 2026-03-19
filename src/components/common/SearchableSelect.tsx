import { useRef, useState, useEffect } from "react";
import {
  Box,
  Input,
  List,
  ListItem,
  useOutsideClick,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react";

type SearchableSelectProps<T> = {
  options: T[];
  value: string | number;
  onChange: (value: string | number, code?: string) => void;
  getLabel: (opt: T) => string;
  getValue: (opt: T) => string | number;
  getCode?: (opt: T) => string;
  placeholder?: string;
  label?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  error?: string;
  isRequired?: boolean;
  dataTestId?: string;
};

export function SearchableSelect<T>({
  options,
  value,
  onChange,
  getLabel,
  getValue,
  getCode,
  placeholder = "Buscar...",
  label,
  isDisabled = false,
  isLoading = false,
  error,
  isRequired,
  dataTestId,
}: SearchableSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick({
    ref: ref as React.RefObject<HTMLElement>,
    handler: () => setIsOpen(false),
  });

  const selectedOption =
    options.find((o) => getValue(o) === value) ??
    options.find(
      (o) => getLabel(o).toLowerCase() === String(value).toLowerCase(),
    );
  const selectedLabel = selectedOption ? getLabel(selectedOption) : "";

  const filterLower = filter.trim().toLowerCase();
  const filtered =
    filterLower === ""
      ? options
      : options.filter((o) => getLabel(o).toLowerCase().includes(filterLower));

  const handleSelect = (opt: T) => {
    onChange(getValue(opt), getCode?.(opt));
    setFilter("");
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) setFilter("");
  }, [isOpen]);

  return (
    <FormControl
      isInvalid={!!error}
      isRequired={isRequired}
      isDisabled={isDisabled}
    >
      {label ? <FormLabel>{label}</FormLabel> : null}
      <Box ref={ref} position="relative">
        <Input
          value={
            isOpen
              ? filter
              : selectedLabel ||
                (typeof value === "number" && value ? String(value) : "")
          }
          onChange={(e) => {
            setFilter(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          readOnly={!isOpen && !!selectedLabel}
          autoComplete="off"
          data-test={dataTestId}
        />
        {isLoading ? (
          <Box
            position="absolute"
            right={3}
            top="50%"
            transform="translateY(-50%)"
          >
            <Spinner size="sm" />
          </Box>
        ) : null}

        {isOpen && (
          <Box
            position="absolute"
            top="100%"
            left={0}
            right={0}
            mt={1}
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            boxShadow="md"
            zIndex={10}
            maxH="200px"
            overflowY="auto"
          >
            {filtered.length === 0 ? (
              <Box px={3} py={2}>
                <Text fontSize="sm" color="gray.500">
                  Nenhum resultado
                </Text>
              </Box>
            ) : (
              <List spacing={0}>
                {filtered.map((opt, idx) => (
                  <ListItem
                    key={idx}
                    px={3}
                    py={2}
                    cursor="pointer"
                    _hover={{ bg: "gray.50" }}
                    onClick={() => handleSelect(opt)}
                    fontSize="sm"
                  >
                    {getLabel(opt)}
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}
      </Box>
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
}
