import React, { Component } from 'react';

import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter';
import ItemAddForm from "../item-add-form";
import './app.css';


export default class App extends Component {

    maxId = 0;

    state = {
        items: [
            this.createTodoItem('play StarCraft 2'),
            this.createTodoItem('do not play StarCraft 2'),
            this.createTodoItem('and play StarCraft 2'),
        ],
        term:'',
        filter: 'all'
    }

    createTodoItem(label) {
        return {
            label,
            import: false,
            done: false,
            id: this.maxId++
        }
    }

    deleteItem = (id) => {
        this.setState(({items}) => {
            const idx = items.findIndex((el) => el.id === id);
            //todoData.splice(idx, 1); it changes state directly
            const before = items.slice(0, idx);// returning every arr elems before idx
            const after = items.slice(idx + 1);//returning every arr elems after idx
            const newArray = [...before, ...after];
            // const  newArray = [
            //     ...todoData.slice(0, idx),
            //     ...todoData.slice(idx + 1)
            // ]

            return{
                items: newArray
            };
        });
    };

    addItem = (text) => {
        const newItem = {
            label: text,
            import: false,
            id: this.maxId++
        };
        this.setState(({items}) =>{
            const newArr = [...items, newItem];
            return {
                items: newArr
            };
        });
    };

    onToggleImportant = (id) => {
        this.setState(({items}) => {
            const idx = items.findIndex((el) => el.id === id);

            //1.update obj
            const oldItem = items[idx];
            const newItem = {...oldItem, important: !oldItem.important};

            //2.construct new obj
            const newArray = [
                ...items.slice(0, idx),
                newItem,
                ...items.slice(idx + 1)
            ];
            return{
                items: newArray
            }
        })
    };

    onToggleDone = (id) => {
        this.setState(({items}) => {
            const idx = items.findIndex((el) => el.id === id);

            const oldItem =  items[idx];
            const newItem = {...oldItem,
                               done: !oldItem.done};

            const newArray = [...items.slice(0, idx),
                                newItem,
                ...items.slice(idx + 1)];
            return{
                items: newArray
            }
        })
    };

    onFilterChange = (filter) => {
        this.setState({ filter });
    };

    search(items, term) {
        if (term.length === 0 ) {
            return items;
        }

        return items.filter((item) => {
            return item.label.toLowerCase().indexOf(term) > -1
        });
    };

    filterItems(items, filter) {
        if (filter === 'all') {
            return items;
        } else if (filter === 'active') {
            return items.filter((item) => (!item.done));
        } else if (filter === 'done') {
            return items.filter((item) => item.done);
        }
    }

    searchItems(items, search) {
        if (search.length === 0) {
            return items;
        }

        return items.filter((item) => {
            return item.label.toLowerCase().indexOf(search.toLowerCase()) > -1;
        });
    }


    onSearchChange = (term) => {
        this.setState({term});
    };

    render() {

        const {items, term,  filter} = this.state;
        const visibleItems = this.searchItems(this.filterItems(items, filter), term);

        const doneCount = items.filter((item) => item.done).length;

        const todoCount = items.length - doneCount;


        return (
            <div className="todo-app">
                <AppHeader toDo={todoCount} done={doneCount}/>
                <div className="top-panel d-flex">
                    <SearchPanel onSearchChange={this.onSearchChange}/>
                    <ItemStatusFilter filter={filter}
                                      onFilterChange={this.onFilterChange}/>
                </div>

                <TodoList items={visibleItems}
                          onDelete={this.deleteItem}
                            onToggleImportant={this.onToggleImportant}
                            onToggleDone={this.onToggleDone}/>

                <ItemAddForm onItemAdd={this.addItem}/>
            </div>
        );
    }
}

