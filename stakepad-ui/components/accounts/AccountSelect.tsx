import { FormControl } from 'baseui/form-control'
import { Option as SelectOption, Select } from 'baseui/select'
import { ReactElement, ReactNode, useEffect, useMemo, useState } from 'react'
import { useApiPromise, useWeb3 } from '../../libs/polkadot'
import { useAddressNormalizer } from '../../libs/queries/useAddressNormalizer'
import { useDepositQuery } from '../../libs/queries/useBalanceQuery'

interface InjectedAccountSelectProps {
    caption?: ReactNode
    defaultAddress?: string
    error?: boolean // set to undefined to let the component verify against injected accounts
    label?: ReactNode
    onChange: (address?: string) => void
}

export const InjectedAccountSelect = ({ caption: customCaption, defaultAddress, error: customError, label, onChange }: InjectedAccountSelectProps): ReactElement => {
    const { api } = useApiPromise()
    const { accounts, readystate } = useWeb3()
    const normalizeAddress = useAddressNormalizer(api)

    const addresses = useMemo(() => accounts?.map(account => account.address) ?? [], [accounts])
    const addressSet = useMemo(() => new Set(addresses), [addresses])
    const options = useMemo(() => addresses.map<SelectOption>(address => ({
        id: address,
        label: address
    })), [addresses])

    const [selectValue, setSelectValue] = useState<readonly SelectOption[]>([])

    const { caption, error } = useMemo(() => {
        const hasSelected = selectValue.length !== 0
        return {
            caption: typeof customCaption !== 'undefined'
                // use if custom caption is provided
                ? customCaption
                // or prompt for required input
                : (hasSelected ? undefined : '选择一个账户'),
            error: typeof customError === 'boolean' ? customError : !hasSelected
        }
    }, [selectValue, customCaption, customError])

    useEffect(() => {
        if (typeof defaultAddress === 'string') {
            setSelectValue([...options.filter(option => option.id === defaultAddress) as readonly SelectOption[]])
        }
    }, [defaultAddress, options])

    useEffect(() => {
        const selected = selectValue[0]?.id as string
        if (selected !== undefined && !addressSet.has(selected)) {
            // update selection while currently selected is valid but not normalized
            const normalized = normalizeAddress(selected)
            if (addressSet.has(normalized)) {
                setSelectValue([{ id: normalized, label: normalized }])
            }
        }
    }, [addressSet, normalizeAddress, options, selectValue])

    useEffect(() => onChange(selectValue[0]?.id?.toString()), [onChange, selectValue])

    return (
        <FormControl caption={caption} label={label}>
            <Select
                error={error}
                isLoading={readystate !== 'ready'}
                onChange={({ value }) => setSelectValue(value)}
                options={options}
                value={selectValue}
            />
        </FormControl>
    )
}

export const InjectedAccountSelectWithStakeWalletBalance = (props: InjectedAccountSelectProps): ReactElement => {
    const [address, setAddress] = useState<string>()

    const { data: balance } = useDepositQuery(address)
    const caption = useMemo(() => balance !== undefined ? '抵押储值余额: ' + balance.toHuman() : undefined, [balance])

    return (
        <InjectedAccountSelect
            {...props}
            caption={caption}
            onChange={address => {
                props.onChange(address)
                setAddress(address)
            }}
        />
    )
}
