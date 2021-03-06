import { Checkbox } from 'baseui/checkbox'
import { StyledLink } from 'baseui/link'
import { TableBuilder, TableBuilderColumn } from 'baseui/table-semantic'
import React, { ReactElement, useCallback, useMemo, useState, useEffect } from 'react'

import { Worker } from '../../libs/apis'
import { SortingField } from '../../libs/apis/workers/findWorkersByStash'

export const MinerTable = ({ isLoading, miners, onSelectionChange, onSortChange }: {
    isLoading?: boolean
    miners: Worker[]
    onSelectionChange: (miners: string[]) => void
    onSortChange: (field?: SortingField, asc?: boolean) => void
}): ReactElement => {
    const [selected, setSelected] = useState<Set<string>>(new Set())
    const [sort, setSort] = useState<SortingField>()
    const [sortAsc, setSortAsc] = useState<boolean>()

    const handleSort = (id: string): void => {
        if (id === sort) {
            setSortAsc(!(sortAsc ?? true))
        } else {
            setSort(id as SortingField)
            setSortAsc(false)
        }
    }

    const handleToggle = (stash: string, checked: boolean): void => {
        const result = checked ? [...selected, stash] : [...selected].filter(sel => sel !== stash)
        setSelected(new Set(result))
        onSelectionChange(result)
    }

    const handleToggleAll = useCallback((checked: boolean): void => {
        const filter = new Set(miners.map(miner => miner.stash))
        const result = checked ? [...selected, ...filter] : [...selected].filter(sel => !filter.has(sel))
        setSelected(new Set(result))
        onSelectionChange(result)
    }, [miners, onSelectionChange, selected])

    const hasCount = useMemo(() => {
        return miners
            .map(miner => selected.has(miner.stash))
            .reduce((count, flag) => flag ? count + 1 : count, 0)
    }, [miners, selected])

    const ToggleAllCheckbox = useMemo(() => (
        <Checkbox
            checked={hasCount === miners.length && hasCount > 0}
            isIndeterminate={hasCount > 0 && hasCount < miners.length}
            onChange={e => handleToggleAll(e.currentTarget.checked)}
        />
    ), [handleToggleAll, hasCount, miners.length])

    useEffect(() => onSortChange(sort, sortAsc), [onSortChange, sort, sortAsc])

    return (
        <>
            <TableBuilder
                data={miners}
                emptyMessage="????????????"
                isLoading={isLoading}
                loadingMessage="?????????"
                onSort={handleSort}
                sortColumn={sort}
                sortOrder={sortAsc !== undefined ? (sortAsc ? 'ASC' : 'DESC') : undefined}
            >
                <TableBuilderColumn header={ToggleAllCheckbox}>
                    {(miner: Worker) => <Checkbox checked={selected.has(miner.stash)} onChange={e => handleToggle(miner.stash, e.currentTarget.checked)} />}
                </TableBuilderColumn>

                <TableBuilderColumn header="??????">{(worker: Worker) => <StyledLink href={`workers/${worker.stash}`}>{worker.stash}</StyledLink>}</TableBuilderColumn>
                <TableBuilderColumn header="?????????" id="profitLastMonth" sortable>{(worker: Worker) => worker.monthlyPayout}</TableBuilderColumn>
                <TableBuilderColumn header="???????????????" id="apy" sortable>{(worker: Worker) => worker.annualizedReturnRate}</TableBuilderColumn>
                <TableBuilderColumn header="?????????" id="accumulatedStake" sortable>{(worker: Worker) => worker.totalStake}</TableBuilderColumn>
                <TableBuilderColumn header="?????????" id="commission" sortable>{(worker: Worker) => worker.commissionRate}</TableBuilderColumn>
                <TableBuilderColumn header="?????????" id="taskScore" sortable>{(worker: Worker) => worker.taskScore}</TableBuilderColumn>
                <TableBuilderColumn header="?????????" id="machineScore" sortable>{(worker: Worker) => worker.minerScore}</TableBuilderColumn>

                <TableBuilderColumn>
                    {(worker: Worker) => <StyledLink href={`workers/${worker.stash}`}>??????</StyledLink>}
                </TableBuilderColumn>
            </TableBuilder>
        </>
    )
}
